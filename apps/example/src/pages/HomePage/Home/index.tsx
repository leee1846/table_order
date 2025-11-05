import { useNavigate } from 'react-router-dom';
import { ButtonExample, MainTitle } from '@repo/ui/components';

import { ROUTES } from '@/constants/routes';
import { UserList } from '@/pages/HomePage/UserList';
import { TYPOGRAPHY } from '@repo/ui';
import { SearchIcon } from '@repo/ui/icons';

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Welcome to Home Page</h2>
      <p style={TYPOGRAPHY.MT_4}>Main Title 1</p>
      <MainTitle />
      <SearchIcon color="red" width={50} height={70} />
      <div style={{ marginTop: '20px' }}>
        <ButtonExample onClick={() => navigate(ROUTES.ABOUT.path)}>
          About 페이지로 이동 →
        </ButtonExample>
      </div>

      <UserList />
    </div>
  );
};
