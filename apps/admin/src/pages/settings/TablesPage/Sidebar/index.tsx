import { AddIcon, HomeFilledIcon } from '@repo/ui/icons';
import * as S from './sidebar.styles';
import { theme } from '@repo/ui';
import { useNavigate } from 'react-router-dom';
import { AddTableGroupDialog } from '../dialogs/AddTableGroupDialog';
import { EditTableGroupDialog } from '../dialogs/EditTableGroupDialog';
import { openDualActionDialog, toast } from '@repo/feature/utils';
import { useQueryClient } from '@repo/api/tanstack-query';
import { queryKeys, useDeleteTableGroup } from '@repo/api/queries';
import { TableGroupItem } from './TableGroupItem';
const { colors } = theme;

import { ROUTES } from '@/constants/routes';
import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import type { ITableGroup } from '@repo/api/types';
import { useAuth } from '@/hooks/useAuth';

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
  const queryClient = useQueryClient();
  const { mutateAsync: deleteTableGroup } = useDeleteTableGroup();

  const { shopCode, shopSeq } = useAuth();

  const [isAddTableGroupDialogOpen, setIsAddTableGroupDialogOpen] =
    useState(false);

  const [isEditTableGroupDialogOpen, setIsEditTableGroupDialogOpen] =
    useState(false);

  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);

  const [buttonPosition, setButtonPosition] = useState<
    'default' | 'bottom' | 'top'
  >('default');

  const tableGroupListRef = useRef<HTMLUListElement>(null);
  const editTableGroupDialogRef = useRef<HTMLDivElement>(null);

  const handleEdit = (group: ITableGroup) => {
    setEditingGroupId(group.tableGroupSeq);
    setIsEditTableGroupDialogOpen(true);
  };

  const handleDelete = async (group: ITableGroup) => {
    openDualActionDialog({
      title: '정말 그룹을 삭제할까요?',
      content: `그룹 명 : ${group.tableGroupName}`,
      primaryText: '확인',
      secondaryText: '취소',
      size: 'xsmall',
      onConfirm: () => {
        deleteTableGroup(
          {
            shopSeq: shopSeq ?? 0,
            tableGroupSeq: group.tableGroupSeq,
          },
          {
            onSuccess: async () => {
              await queryClient.invalidateQueries({
                queryKey: queryKeys.table.groupList(shopCode ?? ''),
              });
              toast('테이블 그룹이 삭제되었습니다.');
              setEditingGroupId(null);
            },
            onError: () => {
              toast('테이블 그룹 삭제에 실패했습니다.');
            },
          }
        );
      },
    });
    setEditingGroupId(null);
  };

  const handleCloseEditDialog = () => {
    setIsEditTableGroupDialogOpen(false);
    setEditingGroupId(null);
  };

  /**
   * ul 컨테이너 내에서 li 요소의 실제 위치를 기준으로 버튼 위치를 계산
   *
   * 스크롤이 있기 때문에 배열 인덱스가 아닌 viewport 내 실제 위치로 판단
   * - 버튼이 ul 상단을 벗어나면: 'bottom' (버튼을 아래로)
   * - 버튼이 ul 하단을 벗어나면: 'top' (버튼을 위로)
   * - 그 외: 'default' (기본 위치)
   */
  const calculateButtonPosition = (groupId: number | null) => {
    if (!groupId || !tableGroupListRef.current) {
      return 'default';
    }

    // 해당 li 요소 찾기 (data-group-id 속성을 이용)
    const listItem = tableGroupListRef.current.querySelector(
      `[data-group-id="${groupId}"]`
    ) as HTMLElement;

    if (!listItem) {
      return 'default';
    }

    // ul 컨테이너와 li 요소의 위치 정보 가져오기
    const containerRect = tableGroupListRef.current.getBoundingClientRect();
    const itemRect = listItem.getBoundingClientRect();

    // 버튼의 예상 높이 (실제 버튼 컴포넌트에 맞게 조정 필요)
    const buttonHeight = 100; // 수정/삭제 버튼 영역의 대략적인 높이

    // 버튼이 위로 나가는지 체크 (li의 상단 - 버튼 높이가 컨테이너 상단보다 위인 경우)
    const wouldOverflowTop = itemRect.top - buttonHeight < containerRect.top;

    // 버튼이 아래로 나가는지 체크 (li의 하단 + 버튼 높이가 컨테이너 하단보다 아래인 경우)
    const wouldOverflowBottom =
      itemRect.bottom + buttonHeight > containerRect.bottom;

    if (wouldOverflowTop) {
      return 'bottom'; // 위로 잘리면 버튼을 아래로
    } else if (wouldOverflowBottom) {
      return 'top'; // 아래로 잘리면 버튼을 위로
    } else {
      return 'default'; // 충분한 공간이 있으면 기본 위치
    }
  };

  /**
   * editingGroupId가 변경될 때마다 버튼 위치를 재계산
   *
   * useLayoutEffect를 사용하여 DOM 업데이트 직후, 브라우저 페인트 전에 위치 계산
   */
  useLayoutEffect(() => {
    const position = calculateButtonPosition(editingGroupId);
    setButtonPosition(position);
  }, [editingGroupId, tableGroups]);

  /**
   * 스크롤 또는 외부 클릭 시 수정/삭제 버튼 숨김 처리
   */
  useEffect(() => {
    const handleScroll = () => {
      setEditingGroupId(null);
    };

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      // 모달이 열려있을 때는 모달 내부 클릭을 무시
      if (isEditTableGroupDialogOpen) {
        if (
          editTableGroupDialogRef.current &&
          editTableGroupDialogRef.current.contains(target)
        ) {
          return;
        }
        return;
      }

      // TableGroupList 내부를 클릭한 경우는 handleItemClick에서 처리
      if (
        tableGroupListRef.current &&
        tableGroupListRef.current.contains(target)
      ) {
        return;
      }
      setEditingGroupId(null);
    };

    // 스크롤 이벤트 리스너 추가 (window와 TableGroupList 모두)
    window.addEventListener('scroll', handleScroll);

    const tableGroupListElement = tableGroupListRef.current;
    if (tableGroupListElement) {
      tableGroupListElement.addEventListener('scroll', handleScroll);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (tableGroupListElement) {
        tableGroupListElement.removeEventListener('scroll', handleScroll);
      }
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [editingGroupId, isEditTableGroupDialogOpen]);

  return (
    <S.Sidebar>
      <S.SidebarLogo>
        {/* <img
          src={logoImage}
          alt="캡스 스마트오더 로고"
          style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
        /> */}
        캡스 스마트오더
      </S.SidebarLogo>

      <S.TableGroupListWrapper>
        <S.TableGroupList ref={tableGroupListRef}>
          {tableGroups.map((group) => (
            <TableGroupItem
              key={group.tableGroupSeq}
              group={group}
              isSelected={selectedTableGroupId === group.tableGroupSeq}
              isEditing={editingGroupId === group.tableGroupSeq}
              buttonPosition={buttonPosition}
              editingGroupId={editingGroupId}
              onSelect={onTableGroupSelect}
              onEdit={() => handleEdit(group)}
              onDelete={() => handleDelete(group)}
              onEditingChange={setEditingGroupId}
            />
          ))}
        </S.TableGroupList>
      </S.TableGroupListWrapper>

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
      />

      <EditTableGroupDialog
        ref={editTableGroupDialogRef}
        isOpen={isEditTableGroupDialogOpen}
        onClose={handleCloseEditDialog}
        tableGroup={
          tableGroups.find((g) => g.tableGroupSeq === editingGroupId)!
        }
      />
    </S.Sidebar>
  );
};
