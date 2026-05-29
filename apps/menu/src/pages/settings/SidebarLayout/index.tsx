import { SettingsSidebar } from '@repo/feature/components';
import { getSidebarMenus } from '@/constants/settings';
import { ROUTES } from '@/constants/routes';
import { useNavigate } from 'react-router-dom';
import { useAdminTranslation } from '@/config/i18n/admin.i18n';
import { useDeviceStore } from '@/stores/useDeviceStore';
import { useRequestAdminAccessModalStore } from '@/stores/useRequestAdminAccessModalStore';
import { capsSmartOrderBlueGreyLogo } from '@repo/ui/icons';

export const SidebarLayout = () => {
  const navigate = useNavigate();
  const { t } = useAdminTranslation();

  const onClickLogo = () => {
    navigate(ROUTES.TABLES.generate());
  };

  const deviceData = useDeviceStore((s) => s.data);
  const onClickHomeButton = () => {
    // 메인 복귀 시 잠깐 잠금 UI 노출 방지
    useRequestAdminAccessModalStore.getState().setShow(false);

    if (deviceData?.tableNumber) {
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
            src={capsSmartOrderBlueGreyLogo}
            alt={t('매장 로고')}
            style={{ width: '100%' }}
          />
        </button>
      }
      onClickHomeButton={onClickHomeButton}
    />
  );
};
