import { SettingsSidebar } from '@repo/feature/components';
import { SIDEBAR_MENUS } from '@/constants/settings';
import { ROUTES } from '@/constants/routes';
import { useNavigate } from 'react-router-dom';
import { bestOnIcon } from '@repo/ui/icons';
import { useTableData } from '@/hooks/useTableData';

export const SidebarLayout = () => {
  const navigate = useNavigate();

  const onClickLogo = () => {
    navigate(ROUTES.TABLES.generate());
  };

  const { data: table } = useTableData({ skipInitialRequest: true });
  const onClickHomeButton = () => {
    if (table?.tableNumber) {
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
