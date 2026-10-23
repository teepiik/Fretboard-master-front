import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import FretboardPage from './pages/FretboardPage';
import About from './pages/About';
import NotFound from './pages/NotFound';

/** Same route table as App, but with a controllable router. */
function renderApp(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fretboard" element={<FretboardPage />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </MemoryRouter>,
  );
}

describe('App routing', () => {
  it('renders the home page with header and navigation', () => {
    renderApp('/');

    expect(screen.getByRole('heading', { name: 'Fretboard Master' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /master your guitar fretboard/i })).toBeInTheDocument();
    const nav = within(screen.getByRole('navigation'));
    expect(nav.getByRole('link', { name: /home/i })).toHaveClass('active');
    expect(nav.getByRole('link', { name: /fretboard/i })).not.toHaveClass('active');
  });

  it('navigates to the fretboard page via the nav link', async () => {
    const user = userEvent.setup();
    renderApp('/');

    const nav = within(screen.getByRole('navigation'));
    await user.click(nav.getByRole('link', { name: /fretboard/i }));

    expect(screen.getByRole('grid', { name: /guitar fretboard/i })).toBeInTheDocument();
    expect(nav.getByRole('link', { name: /fretboard/i })).toHaveClass('active');
  });

  it('renders the about page', () => {
    renderApp('/about');
    expect(screen.getByText(/about page/i)).toBeInTheDocument();
  });

  it('renders 404 for unknown routes', () => {
    renderApp('/does-not-exist');
    expect(screen.getByText(/404/)).toBeInTheDocument();
  });
});
