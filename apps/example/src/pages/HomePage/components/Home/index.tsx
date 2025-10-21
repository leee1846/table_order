import { useNavigate } from 'react-router-dom';
import { Button } from '@repo/ui';
import { ROUTES } from '@/constants/routes';
import { UserList } from '@/pages/HomePage/components/UserList';

export const Home = () => {
  const navigate = useNavigate();

  return (
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

      <UserList />
    </div>
  );
};
