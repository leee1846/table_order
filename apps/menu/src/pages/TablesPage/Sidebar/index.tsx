import * as CommonStyles from '@repo/ui/styles/sidebar.styles';
import { ROUTES } from '@/constants/routes';
import { useNavigate } from 'react-router-dom';
import { useAdminTranslation } from '@/config/i18n/admin.i18n';
import { useShopThemePage } from '@/hooks/useShopThemePage';
import { capsSmartOrderWhiteLogo } from '@repo/ui/icons';

export const Sidebar = () => {
  const navigate = useNavigate();
  const { t } = useAdminTranslation();

  const { data: shopPageSettingData } = useShopThemePage();

  const onClickManagement = () => {
    navigate(ROUTES.SETTINGS.MISCELLANEOUS.generate());
  };

  return (
    <CommonStyles.SidebarContainer>
      <CommonStyles.Logo>
        <img
          src={
            shopPageSettingData?.shopThemeData?.logoImagePath ??
            capsSmartOrderWhiteLogo
          }
          alt={t('매장 로고')}
        />
      </CommonStyles.Logo>

      <CommonStyles.MenuList>
        <CommonStyles.MenuItem isSelected={false} onClick={onClickManagement}>
          {t('관리')}
        </CommonStyles.MenuItem>
      </CommonStyles.MenuList>
    </CommonStyles.SidebarContainer>
  );
};
