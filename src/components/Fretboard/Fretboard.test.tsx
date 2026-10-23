import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Fretboard from './Fretboard';

describe('Fretboard', () => {
  it('renders an accessible grid with 6 strings and the right number of fret columns', () => {
    render(<Fretboard rootNote="C" scaleType="major" numFrets={12} />);

    const grid = screen.getByRole('grid', { name: /guitar fretboard/i });
    expect(within(grid).getAllByRole('columnheader')).toHaveLength(13);
    expect(grid.querySelectorAll('.guitar-string')).toHaveLength(6);
  });

  it('puts high E on top and low E on the bottom', () => {
    const { container } = render(<Fretboard rootNote="C" scaleType="major" />);
    const strings = container.querySelectorAll('.guitar-string');
    expect(strings[0]).toHaveAttribute('data-string', '1');
    expect(strings[0]).toHaveClass('guitar-string--thin');
    expect(strings[5]).toHaveAttribute('data-string', '6');
    expect(strings[5]).toHaveClass('guitar-string--thick');
  });

  it('highlights root and scale notes and hides out-of-scale notes', () => {
    const { container } = render(<Fretboard rootNote="A" scaleType="pentatonic minor" />);
    const lowE = container.querySelector('[data-string="6"]')!;

    const fretA = lowE.querySelector('[data-fret="5"]')!;
    expect(fretA.querySelector('.note-circle')).toHaveClass('note-circle--root');
    expect(fretA).toHaveTextContent('A');

    const fretG = lowE.querySelector('[data-fret="3"]')!;
    expect(fretG.querySelector('.note-circle')).toHaveClass('note-circle--scale');

    const fretF = lowE.querySelector('[data-fret="1"]')!;
    expect(fretF.querySelector('.note-circle')).toBeNull();
  });

  it('hides note labels when showNoteNames is false', () => {
    const { container } = render(<Fretboard rootNote="C" scaleType="major" showNoteNames={false} />);
    expect(container.querySelector('.note-circle')).not.toBeNull();
    expect(container.querySelector('.note-circle__label')).toBeNull();
  });

  it('calls onNoteClick with low-to-high string index and fret', async () => {
    const user = userEvent.setup();
    const onNoteClick = vi.fn();
    const { container } = render(<Fretboard rootNote="C" scaleType="major" onNoteClick={onNoteClick} />);

    // Low E string (data-string=6) is stringIndex 0; fret 8 is C (root)
    const note = container.querySelector('[data-string="6"] [data-fret="8"] .note-circle')!;
    await user.click(note);

    expect(onNoteClick).toHaveBeenCalledWith(0, 8);
  });
});
