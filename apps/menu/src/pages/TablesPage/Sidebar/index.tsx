import * as CommonStyles from '@repo/ui/styles/sidebar.styles';
import type { ITableGroup } from '@repo/api/types';
import { ROUTES } from '@/constants/routes';
import { useNavigate } from 'react-router-dom';
import { useAdminTranslation } from '@/config/i18n/admin.i18n';
import { useShopThemePage } from '@/hooks/useShopThemePage';

interface Props {
  tableGroups?: ITableGroup[];
  selectedTableGroupSeq: number;
  onTableGroupClick: (tableGroupSeq: number) => void;
}
export const Sidebar = ({
  tableGroups,
  selectedTableGroupSeq,
  onTableGroupClick,
}: Props) => {
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
          src={shopPageSettingData?.shopThemeData?.logoImagePath ?? ''}
          alt={t('매장 로고')}
        />
      </CommonStyles.Logo>

      <CommonStyles.MenuList>
        {tableGroups?.map((tableGroup) => (
          <CommonStyles.MenuItem
            key={tableGroup.tableGroupSeq}
            isSelected={selectedTableGroupSeq === tableGroup.tableGroupSeq}
            onClick={() => onTableGroupClick(tableGroup.tableGroupSeq)}
          >
            {tableGroup.tableGroupName}
          </CommonStyles.MenuItem>
        ))}

        <CommonStyles.MenuItem isSelected={false} onClick={onClickManagement}>
          {t('관리')}
        </CommonStyles.MenuItem>
      </CommonStyles.MenuList>
    </CommonStyles.SidebarContainer>
  );
};
