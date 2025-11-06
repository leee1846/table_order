import { useNavigate } from 'react-router-dom';
import { Button } from '@repo/ui/components';
import { ROUTES } from '@/constants/routes';

export const UserProfile = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div style={{ marginTop: '30px' }}>
        <Button onClick={() => navigate(ROUTES.HOME.path)}>
          ← Home으로 돌아가기
        </Button>
      </div>
    </div>
  );
};
