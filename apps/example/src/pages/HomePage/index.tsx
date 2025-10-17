import reactLogo from '@/assets/react.svg';
import viteLogo from '/vite.svg';
import { Home } from '@/pages/HomePage/components/Home';

export const HomePage = () => {
  return (
    <div className="home-page">
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>Turborepo Example</h1>

      <Home />
    </div>
  );
};
