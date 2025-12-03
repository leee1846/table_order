import { AddIcon, HomeFilledIcon } from '@repo/ui/icons';
import * as S from './sidebar.styles';
import { theme } from '@repo/ui';
import { useNavigate } from 'react-router-dom';
import { AddTableGroupDialog } from '../dialogs/AddTableGroupDialog';
const { colors } = theme;

import { ROUTES } from '@/constants/routes';
import { useState } from 'react';
import { toast } from '@repo/feature/utils';
import type { ITableGroup } from '@repo/api/types';

interface SidebarProps {
  tableGroups: ITableGroup[];
  selectedTableGroupId: number | null;
  onTableGroupSelect: (groupId: number) => void;
}

export const Sidebar = ({
  tableGroups,
  selectedTableGroupId,
  onTableGroupSelect,
}: SidebarProps) => {
  const navigate = useNavigate();
  const [isAddTableGroupDialogOpen, setIsAddTableGroupDialogOpen] =
    useState(false);

  const handleAddTableGroup = () => {};
  return (
    <S.Sidebar>
      <S.SidebarLogo
        onClick={() => {
          toast('test', {
            position: 'top-center',
          });
        }}
      >
        {/* <img
          src={logoImage}
          alt="캡스 스마트오더 로고"
          style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
        /> */}
        캡스 스마트오더
      </S.SidebarLogo>

      <S.TableGroupList>
        {tableGroups.map((group) => (
          <S.TableGroupItem
            key={group.tableGroupSeq}
            onClick={() => onTableGroupSelect(group.tableGroupSeq)}
            isSelected={selectedTableGroupId === group.tableGroupSeq}
          >
            {group.tableGroupName}
          </S.TableGroupItem>
        ))}
      </S.TableGroupList>

      <S.AddGroupButtonContainer>
        <S.AddGroupButton
          type="button"
          onClick={() => {
            setIsAddTableGroupDialogOpen(true);
          }}
        >
          <AddIcon width={20} height={20} color={colors.grey[200]} />
          <span>그룹 추가</span>
        </S.AddGroupButton>
      </S.AddGroupButtonContainer>

      <S.FloatingHomeButton
        type="button"
        onClick={() => navigate(ROUTES.TABLES.generate())}
      >
        <HomeFilledIcon width={24} height={24} color={colors.grey[700]} />
        <span>메인 홈</span>
      </S.FloatingHomeButton>

      <AddTableGroupDialog
        isOpen={isAddTableGroupDialogOpen}
        onClose={() => setIsAddTableGroupDialogOpen(false)}
        onSubmit={handleAddTableGroup}
      />
    </S.Sidebar>
  );
};
