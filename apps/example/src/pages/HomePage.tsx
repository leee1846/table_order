import { useNavigate } from 'react-router-dom';
import { Button } from '@repo/ui/button';
import { ROUTES } from '@/constants/routes';
import reactLogo from '@/assets/react.svg';
import viteLogo from '/vite.svg';

export const HomePage = () => {
  const navigate = useNavigate();

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

      <div className="card">
        <h2>Welcome to Home Page</h2>
        <p>이 페이지는 Turborepo의 구조와 사용법을 보여주는 예제입니다.</p>

        <div style={{ marginTop: '20px' }}>
          <Button
            onClick={() => navigate(ROUTES.ABOUT.path)}
            className="navigation-button"
          >
            About 페이지로 이동 →
          </Button>
        </div>
      </div>
    </div>
  );
};
