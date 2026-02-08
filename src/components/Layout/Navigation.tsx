import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/fretboard', label: 'Fretboard', icon: '🎸' },
    { path: '/about', label: 'About', icon: 'ℹ️' },
  ];

  return (
    <nav className="main-navigation">
      <ul className="nav-list">
        {navItems.map(item => (
          <li key={item.path} className="nav-item">
            <Link to={item.path} className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}>
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
