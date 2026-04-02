import { SettingsSidebar } from '@repo/feature/components';
import { getSidebarMenus } from '@/constants/settings';
import { ROUTES } from '@/constants/routes';
import { useNavigate } from 'react-router-dom';
import { useAdminTranslation } from '@/config/i18n/admin.i18n';
import { AppStorage } from '@repo/util/app';
import { STORAGE_KEYS } from '@/constants/keys';
import { useShopThemePage } from '@/hooks/useShopThemePage';
import { useDeviceStore } from '@/stores/useDeviceStore';
import { useRequestAdminAccessModalStore } from '@/stores/useRequestAdminAccessModalStore';

export const SidebarLayout = () => {
  const navigate = useNavigate();
  const { t } = useAdminTranslation();

  const { data: shopPageSettingData } = useShopThemePage();

  const onClickLogo = () => {
    navigate(ROUTES.TABLES.generate());
  };

  const deviceData = useDeviceStore((s) => s.data);
  const onClickHomeButton = () => {
    // 메인 복귀 시 잠깐 잠금 UI 노출 방지
    useRequestAdminAccessModalStore.getState().setShow(false);

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
      menus={getSidebarMenus(t, deviceData?.deviceType)}
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
