import { useNavigate } from 'react-router-dom';
import { Button } from '@repo/ui/button';
import { ROUTES } from '@/constants/routes';
import '@/App.css';

export const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      <h1>About Page</h1>

      <div className="card">
        <div style={{ marginTop: '30px' }}>
          <Button
            onClick={() => navigate(ROUTES.HOME)}
            className="navigation-button"
          >
            ← Home으로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  );
};
