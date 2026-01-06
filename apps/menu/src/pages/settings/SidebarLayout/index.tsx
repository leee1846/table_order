import { SettingsSidebar } from '@repo/feature/components';
import { getSidebarMenus } from '@/constants/settings';
import { ROUTES } from '@/constants/routes';
import { useNavigate } from 'react-router-dom';
import { useDeviceData } from '@/hooks/useDeviceData';
import { useAdminTranslation } from '@/config/i18n/admin.i18n';
import { AppStorage } from '@repo/util/app';
import { STORAGE_KEYS } from '@/constants/keys';
import { useShopThemePage } from '@/hooks/useShopThemePage';

export const SidebarLayout = () => {
  const navigate = useNavigate();
  const { t } = useAdminTranslation();

  const { data: shopPageSettingData } = useShopThemePage();

  const onClickLogo = () => {
    navigate(ROUTES.TABLES.generate());
  };

  const { data: deviceData } = useDeviceData({ skipInitialRequest: true });
  const onClickHomeButton = () => {
    if (deviceData?.tableNumber) {
      AppStorage.removeData({
        key: STORAGE_KEYS.ADMIN_PASSWORD_VERIFIED,
      });
      navigate(ROUTES.ROOT.generate());
      return;
    }

    navigate(ROUTES.TABLES.generate());
  };

  return (
    <SettingsSidebar
      useTranslation={useAdminTranslation}
      menus={getSidebarMenus(t)}
      logoElement={
        <button type="button" onClick={onClickLogo} style={{ width: '100%' }}>
          <img
            src={shopPageSettingData?.shopThemeData?.logoImagePath ?? ''}
            alt={t('매장 로고')}
            style={{ width: '100%' }}
          />
        </button>
      }
      onClickHomeButton={onClickHomeButton}
    />
  );
};
