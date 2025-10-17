import { useNavigate } from 'react-router-dom';
import { Button } from '@repo/ui/button';
import { ROUTES } from '@/constants/routes';

export const UserProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="card">
      <div style={{ marginTop: '30px' }}>
        <Button
          onClick={() => navigate(ROUTES.HOME.path)}
          className="navigation-button"
        >
          ← Home으로 돌아가기
        </Button>
      </div>
    </div>
  );
};
