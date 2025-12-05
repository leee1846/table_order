import { SettingsSidebar } from '@repo/feature/components';
import { SIDEBAR_MENUS } from '@/constants/settings';
import { ROUTES } from '@/constants/routes';
import { useNavigate } from 'react-router-dom';
import { bestOnIcon } from '@repo/ui/icons';

const tableNumber = 1;

export const SidebarLayout = () => {
  const navigate = useNavigate();

  const onClickLogo = () => {
    navigate(ROUTES.TABLES.generate());
  };

  const onClickHomeButton = () => {
    if (tableNumber) {
      navigate(ROUTES.ROOT.generate());
      return;
    }

    navigate(ROUTES.TABLES.generate());
  };

  return (
    <SettingsSidebar
      menus={SIDEBAR_MENUS}
      logoElement={
        <button type="button" onClick={onClickLogo}>
          <img src={bestOnIcon} alt="logo" />
        </button>
      }
      onClickHomeButton={onClickHomeButton}
    />
  );
};
