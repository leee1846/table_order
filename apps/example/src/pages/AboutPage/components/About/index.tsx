import { useNavigate } from 'react-router-dom';
import { ButtonExample } from '@repo/ui';
import { ROUTES } from '@/constants/routes';

export const About = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div style={{ marginTop: '30px' }}>
        <ButtonExample
          onClick={() => navigate(ROUTES.USER_PROFILE.generate(1))}
        >
          User Profile로 이동 →
        </ButtonExample>
      </div>
    </div>
  );
};
