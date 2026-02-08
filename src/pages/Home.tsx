// pages/Home.tsx
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <h1>Welcome to the Fretboard App</h1>
      <p>Learn and master the guitar fretboard with our interactive tool.</p>
      <Link to="/fretboard" className="cta-button">
        Go to Fretboard
      </Link>
    </div>
  );
};

export default Home;
