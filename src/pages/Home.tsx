// pages/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Master Your Guitar Fretboard</h1>
          <p>
            Interactive guitar fretboard visualization tool for learning scales, chords, and improving your fretboard
            knowledge.
          </p>
          <div className="hero-actions">
            <Link to="/fretboard" className="cta-button primary">
              Start Learning
            </Link>
            <Link to="/about" className="cta-button secondary">
              Learn More
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="guitar-illustration">🎸</div>
        </div>
      </section>

      <section className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎵</div>
            <h3>Scale Visualization</h3>
            <p>See scales across the entire fretboard with highlighted notes and intervals.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎸</div>
            <h3>Chord Shapes</h3>
            <p>Learn chord fingerings and see multiple positions for the same chord.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔧</div>
            <h3>Multiple Tunings</h3>
            <p>Support for standard tuning, drop D, DADGAD, and many other tunings.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Visual Learning</h3>
            <p>Color-coded notes, interval displays, and intuitive visual feedback.</p>
          </div>
        </div>
      </section>

      <section className="quick-start">
        <h2>Quick Start</h2>
        <div className="steps">
          <div className="step">
            <span className="step-number">1</span>
            <p>Choose your tuning</p>
          </div>
          <div className="step">
            <span className="step-number">2</span>
            <p>Select a scale or chord</p>
          </div>
          <div className="step">
            <span className="step-number">3</span>
            <p>Explore the fretboard</p>
          </div>
        </div>
        <Link to="/fretboard" className="start-button">
          Go to Fretboard →
        </Link>
      </section>
    </div>
  );
};

export default Home;
