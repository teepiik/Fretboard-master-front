import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FretboardPage from './FretboardPage';

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
});
