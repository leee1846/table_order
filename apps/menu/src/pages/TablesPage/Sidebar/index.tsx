import * as CommonStyles from '@repo/ui/styles/sidebar.styles';
import { ROUTES } from '@/constants/routes';
import { useNavigate } from 'react-router-dom';
import { useAdminTranslation } from '@/config/i18n/admin.i18n';
import { useRemoteSupport } from '@repo/feature/hooks';
import { capsSmartOrderBlueGreyLogo, HomeFilledIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { toast } from '@repo/feature/utils';
import { AppStorage } from '@repo/util/app';
import { STORAGE_KEYS } from '@/constants/keys';
import { useDeviceStore } from '@/stores/useDeviceStore';
import { useRequestAdminAccessModalStore } from '@/stores/useRequestAdminAccessModalStore';
import * as S from './sidebar.styles';

export const Sidebar = () => {
  const navigate = useNavigate();
  const { t } = useAdminTranslation();
  const { isRemoteSupportVisible, openRemoteSupport } = useRemoteSupport(t);

  const onClickManagement = () => {
    navigate(ROUTES.SETTINGS.MISCELLANEOUS.generate());
  };

  const onClickHomeButton = () => {
    // 메인 복귀 시 잠깐 잠금 UI 노출 방지
    useRequestAdminAccessModalStore.getState().setShow(false);

    if (useDeviceStore.getState().data?.tableNumber) {
      AppStorage.removeData({
        key: STORAGE_KEYS.ADMIN_PASSWORD_VERIFIED,
      });
      navigate(ROUTES.ROOT.generate());
      return;
    }

    toast(t('테이블을 선택해주세요.'));
  };

  return (
    <CommonStyles.SidebarContainer>
      <CommonStyles.Logo>
        <img src={capsSmartOrderBlueGreyLogo} alt={t('매장 로고')} />
      </CommonStyles.Logo>

      <CommonStyles.MenuList>
        <CommonStyles.MenuItem isSelected={false} onClick={onClickManagement}>
          {t('관리')}
        </CommonStyles.MenuItem>
        {isRemoteSupportVisible && (
          <CommonStyles.MenuItem
            isSelected={false}
            onClick={() => void openRemoteSupport()}
          >
            {t('원격지원')}
          </CommonStyles.MenuItem>
        )}
      </CommonStyles.MenuList>

      <S.HomeButton type="button" onClick={onClickHomeButton}>
        <HomeFilledIcon width={24} height={24} color={theme.colors.grey[600]} />
        <span>{t('메인 홈')}</span>
      </S.HomeButton>
    </CommonStyles.SidebarContainer>
  );
};
