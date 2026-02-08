import Navigation from './Navigation';

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo">
          <h1>Fretboard Master</h1>
        </div>
        <Navigation />
      </div>
    </header>
  );
};

export default Header;
