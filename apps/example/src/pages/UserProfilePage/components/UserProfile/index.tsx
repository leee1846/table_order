import { useNavigate } from 'react-router-dom';
import { ButtonExample } from '@repo/ui';
import { ROUTES } from '@/constants/routes';

export const UserProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="card">
      <div style={{ marginTop: '30px' }}>
        <ButtonExample
          onClick={() => navigate(ROUTES.HOME.path)}
          className="navigation-button"
        >
          ← Home으로 돌아가기
        </ButtonExample>
      </div>
    </div>
  );
};
