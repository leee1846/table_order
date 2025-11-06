import { useNavigate } from 'react-router-dom';
import { Button } from '@repo/ui/components';
import { ROUTES } from '@/constants/routes';

export const About = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div style={{ marginTop: '30px' }}>
        <Button onClick={() => navigate(ROUTES.USER_PROFILE.generate(1))}>
          User Profile로 이동 →
        </Button>
      </div>
    </div>
  );
};
