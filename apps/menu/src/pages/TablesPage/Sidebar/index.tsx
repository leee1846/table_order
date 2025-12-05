import * as CommonStyles from '@repo/ui/styles/sidebar.styles';
import { bestOnIcon } from '@repo/ui/icons';
import type { ITableGroup } from '@repo/api/types';
import { ROUTES } from '@/constants/routes';
import { useNavigate } from 'react-router-dom';

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

  const onClickManagement = () => {
    navigate(ROUTES.SETTINGS.MISCELLANEOUS.generate());
  };

  return (
    <CommonStyles.SidebarContainer>
      <CommonStyles.Logo>
        <img src={bestOnIcon} />
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
          관리
        </CommonStyles.MenuItem>
      </CommonStyles.MenuList>
    </CommonStyles.SidebarContainer>
  );
};
