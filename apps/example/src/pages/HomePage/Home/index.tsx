import { useNavigate } from 'react-router-dom';
import { BasicButton } from '@repo/ui/components';

import { ROUTES } from '@/constants/routes';
import { UserList } from '@/pages/HomePage/UserList';
import { TYPOGRAPHY } from '@repo/ui';
import { MenuIcon, ArrowBackIcon, ArrowForwardIcon } from '@repo/ui/icons';

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Welcome to Home Page??</h2>
      <p style={TYPOGRAPHY.MT_4}>Main Title 1</p>
      <MenuIcon color="red" />
      <ArrowBackIcon color="green" />
      <ArrowForwardIcon color="blue" />
      <div style={{ marginTop: '20px' }}>
        <BasicButton
          variant="Solid_Navy_M"
          onClick={() => navigate(ROUTES.ABOUT.path)}
        >
          Solid_Navy_M
        </BasicButton>
        <BasicButton
          variant="Solid_Sky_Blue_M"
          onClick={() => navigate(ROUTES.ABOUT.path)}
        >
          Solid_Sky_Blue_M
        </BasicButton>
        <BasicButton
          variant="Solid_Grey_M"
          onClick={() => navigate(ROUTES.ABOUT.path)}
        >
          Solid_Grey_M
        </BasicButton>
        <BasicButton
          variant="Outline_Navy_M"
          onClick={() => navigate(ROUTES.ABOUT.path)}
        >
          Outline_Navy_M
        </BasicButton>
        <BasicButton
          variant="Outline_Grey_M"
          onClick={() => navigate(ROUTES.ABOUT.path)}
        >
          Outline_Grey_M
        </BasicButton>

        <BasicButton
          variant="Solid_Navy_M"
          onClick={() => navigate(ROUTES.ABOUT.path)}
          disabled={true}
        >
          Solid_Navy_M
        </BasicButton>
        <BasicButton
          variant="Solid_Sky_Blue_M"
          onClick={() => navigate(ROUTES.ABOUT.path)}
          disabled={true}
        >
          Solid_Sky_Blue_M
        </BasicButton>
        <BasicButton
          variant="Solid_Grey_M"
          onClick={() => navigate(ROUTES.ABOUT.path)}
          disabled={true}
        >
          Solid_Grey_M
        </BasicButton>
        <BasicButton
          variant="Outline_Navy_M"
          onClick={() => navigate(ROUTES.ABOUT.path)}
          disabled={true}
        >
          Outline_Navy_M
        </BasicButton>
        <BasicButton
          variant="Outline_Grey_M"
          onClick={() => navigate(ROUTES.ABOUT.path)}
          disabled={true}
        >
          Outline_Grey_M
        </BasicButton>
      </div>

      <UserList />
    </div>
  );
};
