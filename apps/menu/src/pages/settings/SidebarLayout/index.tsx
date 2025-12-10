import { SettingsSidebar } from '@repo/feature/components';
import { getSidebarMenus } from '@/constants/settings';
import { ROUTES } from '@/constants/routes';
import { useNavigate } from 'react-router-dom';
import { bestOnIcon } from '@repo/ui/icons';
import { useTableData } from '@/hooks/useTableData';
import { useAdminTranslation } from '@/config/i18n/admin.i18n';
import storage from '@/utils/storage';
import { STORAGE_KEYS } from '@/constants/keys';

export const SidebarLayout = () => {
  const navigate = useNavigate();
  const { t } = useAdminTranslation();

  const onClickLogo = () => {
    navigate(ROUTES.TABLES.generate());
  };

  const { data: table } = useTableData({ skipInitialRequest: true });
  const onClickHomeButton = () => {
    if (table?.tableNumber) {
      storage.remove(STORAGE_KEYS.ADMIN_PASSWORD_VERIFIED);
      navigate(ROUTES.ROOT.generate());
      return;
    }

    navigate(ROUTES.TABLES.generate());
  };

  return (
    <SettingsSidebar
      menus={getSidebarMenus(t)}
      logoElement={
        <button type="button" onClick={onClickLogo}>
          <img src={bestOnIcon} alt="logo" />
        </button>
      }
      onClickHomeButton={onClickHomeButton}
    />
  );
};
