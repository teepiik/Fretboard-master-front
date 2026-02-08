import { Link, useLocation } from 'react-router-dom';

export const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/fretboard', label: 'Fretboard' },
    { path: '/about', label: 'About' },
  ];

  return (
    <nav className="main-navigation">
      <ul className="nav-list">
        {navItems.map(item => (
          <li key={item.path} className="nav-item">
            <Link to={item.path} className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}>
              <span className="nav-label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
