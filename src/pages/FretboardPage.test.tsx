import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FretboardPage from './FretboardPage';
import { breakpoints } from '../styles/breakpoints';
import { setViewportWidth } from '../test/matchMedia';

describe('FretboardPage', () => {
  it('renders with C major by default', () => {
    render(<FretboardPage />);

    expect(screen.getByRole('heading', { name: 'Fretboard' })).toBeInTheDocument();
    expect(screen.getByLabelText('Root Note')).toHaveValue('C');
    expect(screen.getByLabelText('Scale')).toHaveValue('major');
    expect(screen.getByLabelText('Frets')).toHaveValue('12');
    expect(screen.getByText('Root:')).toHaveTextContent('Root: C');
    expect(screen.getByText('Scale:')).toHaveTextContent('Scale: Major');
  });

  it('updates the fretboard and summary when root and scale change', async () => {
    const user = userEvent.setup();
    const { container } = render(<FretboardPage />);

    await user.selectOptions(screen.getByLabelText('Root Note'), 'A');
    await user.selectOptions(screen.getByLabelText('Scale'), 'pentatonic minor');

    expect(screen.getByText('Root:')).toHaveTextContent('Root: A');
    expect(screen.getByText('Scale:')).toHaveTextContent('Scale: Pentatonic Minor');

    const openLowE = container.querySelector('[data-string="6"] [data-fret="0"]')!;
    expect(openLowE.querySelector('.note-circle')).toHaveClass('note-circle--scale');
    expect(openLowE).toHaveTextContent('E');
  });

  it('changes the number of frets', async () => {
    const user = userEvent.setup();
    render(<FretboardPage />);

    await user.selectOptions(screen.getByLabelText('Frets'), '24');

    const grid = screen.getByRole('grid');
    expect(within(grid).getAllByRole('columnheader')).toHaveLength(25);
  });

  it('toggles note name labels', async () => {
    const user = userEvent.setup();
    const { container } = render(<FretboardPage />);

    expect(container.querySelector('.note-circle__label')).not.toBeNull();
    await user.click(screen.getByLabelText(/show note names/i));
    expect(container.querySelector('.note-circle__label')).toBeNull();
  });

  describe('mobile view', () => {
    it('renders a simplified page with a vertical fretboard at the mobile breakpoint', () => {
      setViewportWidth(breakpoints.mobile);
      const { container } = render(<FretboardPage />);

      expect(container.firstElementChild).toHaveClass('fretboard-page--mobile');
      expect(screen.getByRole('grid')).toHaveAttribute('data-orientation', 'vertical');
      // Root/scale summary is dropped (redundant with the controls); legend stays.
      expect(screen.queryByText('Root:')).toBeNull();
      expect(screen.getByText('Scale note')).toBeInTheDocument();
      // Controls still work.
      expect(screen.getByLabelText('Root Note')).toHaveValue('C');
    });

    it('switches orientation live when the viewport crosses the breakpoint', () => {
      const { container } = render(<FretboardPage />);
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
