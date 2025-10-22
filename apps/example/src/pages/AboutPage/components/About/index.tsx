import { useNavigate } from 'react-router-dom';
import { ButtonExample } from '@repo/ui';
import { ROUTES } from '@/constants/routes';

export const About = () => {
  const navigate = useNavigate();

  return (
    <div className="card">
      <div style={{ marginTop: '30px' }}>
        <ButtonExample
          onClick={() => navigate(ROUTES.USER_PROFILE.generate(1))}
          className="navigation-button"
        >
          User Profile로 이동 →
        </ButtonExample>
      </div>
    </div>
  );
};
