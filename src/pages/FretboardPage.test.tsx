import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FretboardPage from './FretboardPage';
import { breakpoints } from '../styles/breakpoints';
import { setViewportWidth } from '../test/matchMedia';
import { fakeApiRequests, installFakeApi } from '../test/fakeApi';

/** Render and wait for the scale catalogue to arrive. */
async function renderPage() {
  const result = render(<FretboardPage />);
  await screen.findByRole('grid', { name: /guitar fretboard/i });
  return result;
}

describe('FretboardPage', () => {
  it('shows a loading state, then renders C major by default', async () => {
    render(<FretboardPage />);
    expect(screen.getByRole('status')).toHaveTextContent(/loading/i);

    await screen.findByRole('grid');
    expect(screen.getByRole('heading', { name: 'Fretboard' })).toBeInTheDocument();
    expect(screen.getByLabelText('Root Note')).toHaveValue('C');
    expect(screen.getByLabelText('Scale')).toHaveValue('major');
    expect(screen.getByLabelText('Frets')).toHaveValue('12');
    expect(screen.getByText('Root:')).toHaveTextContent('Root: C');
    expect(screen.getByText('Scale:')).toHaveTextContent('Scale: Major');
  });

  it('populates the scale dropdown from the backend catalogue, fetched once', async () => {
    await renderPage();
    const options = within(screen.getByLabelText('Scale')).getAllByRole('option');
    expect(options.map(o => o.textContent)).toEqual(['Major', 'Natural Minor (Aeolian)', 'Minor Pentatonic']);
    expect(fakeApiRequests().map(r => new URL(r.url).pathname)).toEqual(['/theory/scales']);
  });

  it('recomputes the fretboard locally when root and scale change', async () => {
    const user = userEvent.setup();
    const { container } = await renderPage();

    await user.selectOptions(screen.getByLabelText('Root Note'), 'A');
    await user.selectOptions(screen.getByLabelText('Scale'), 'minor-pentatonic');

    expect(screen.getByText('Root:')).toHaveTextContent('Root: A');
    expect(screen.getByText('Scale:')).toHaveTextContent('Scale: Minor Pentatonic');

    const lowE = container.querySelector('[data-string="6"]')!;
    expect(lowE.querySelector('[data-fret="0"] .note-circle')).toHaveClass('note-circle--scale');
    expect(lowE.querySelector('[data-fret="5"] .note-circle')).toHaveClass('note-circle--root');
    // No extra network calls for a scale/root change.
    expect(fakeApiRequests()).toHaveLength(1);
  });

  it('changes the number of frets', async () => {
    const user = userEvent.setup();
    await renderPage();

    await user.selectOptions(screen.getByLabelText('Frets'), '24');
    expect(within(screen.getByRole('grid')).getAllByRole('columnheader')).toHaveLength(25);
  });

  it('toggles note name labels', async () => {
    const user = userEvent.setup();
    const { container } = await renderPage();

    expect(container.querySelector('.note-circle__label')).not.toBeNull();
    await user.click(screen.getByLabelText(/show note names/i));
    expect(container.querySelector('.note-circle__label')).toBeNull();
  });

  it('shows an error with retry when the backend fails', async () => {
    const user = userEvent.setup();
    installFakeApi({ failWith: { status: 500, error: 'Internal server error' } });
    render(<FretboardPage />);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/internal server error/i);
    expect(screen.getByLabelText('Scale')).toBeDisabled();

    installFakeApi();
    await user.click(within(alert).getByRole('button', { name: /retry/i }));
    await screen.findByRole('grid');
    expect(screen.getByLabelText('Scale')).toBeEnabled();
  });

  describe('mobile view', () => {
    it('renders a simplified page with a vertical fretboard at the mobile breakpoint', async () => {
      setViewportWidth(breakpoints.mobile);
      const { container } = await renderPage();

      expect(container.firstElementChild).toHaveClass('fretboard-page--mobile');
      expect(screen.getByRole('grid')).toHaveAttribute('data-orientation', 'vertical');
      // Root/scale summary is dropped (redundant with the controls); legend stays.
      expect(screen.queryByText('Root:')).toBeNull();
      expect(screen.getByText('Scale note')).toBeInTheDocument();
      // Controls still work.
      expect(screen.getByLabelText('Root Note')).toHaveValue('C');
    });

    it('switches orientation live when the viewport crosses the breakpoint', async () => {
      const { container } = await renderPage();
      expect(screen.getByRole('grid')).toHaveAttribute('data-orientation', 'horizontal');

      setViewportWidth(breakpoints.mobile - 100);
      expect(screen.getByRole('grid')).toHaveAttribute('data-orientation', 'vertical');
      expect(container.firstElementChild).toHaveClass('fretboard-page--mobile');

      setViewportWidth(breakpoints.mobile + 1);
      expect(screen.getByRole('grid')).toHaveAttribute('data-orientation', 'horizontal');
      expect(container.firstElementChild).not.toHaveClass('fretboard-page--mobile');
    });
  });
});
