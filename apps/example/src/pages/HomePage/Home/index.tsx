import { useNavigate } from 'react-router-dom';
import { Button, MainTitle } from '@repo/ui/components';

import { ROUTES } from '@/constants/routes';
import { UserList } from '@/pages/HomePage/UserList';
import { TYPOGRAPHY } from '@repo/ui';
import { MenuIcon, ArrowBackIcon, ArrowForwardIcon } from '@repo/ui/icons';

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Welcome to Home Page</h2>
      <p style={TYPOGRAPHY.MT_4}>Main Title 1</p>
      <MainTitle />
      <MenuIcon color="red" />
      <ArrowBackIcon color="green" />
      <ArrowForwardIcon color="blue" />
      <div style={{ marginTop: '20px' }}>
        <Button onClick={() => navigate(ROUTES.ABOUT.path)}>
          About 페이지로 이동 →
        </Button>
      </div>

      <UserList />
    </div>
  );
};
