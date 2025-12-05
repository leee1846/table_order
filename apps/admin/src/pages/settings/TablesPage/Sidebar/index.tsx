import { AddIcon, HomeFilledIcon, EditIcon, DeleteIcon } from '@repo/ui/icons';
import * as S from './sidebar.styles';
import { theme } from '@repo/ui';
import { useNavigate } from 'react-router-dom';
import { AddTableGroupDialog } from '../dialogs/AddTableGroupDialog';
import { EditTableGroupDialog } from '../dialogs/EditTableGroupDialog';
import { openDualActionDialog, toast } from '@repo/feature/utils';
import { useQueryClient } from '@repo/api/tanstack-query';
import { queryKeys, useDeleteTableGroup } from '@repo/api/queries';
const { colors } = theme;

import { ROUTES } from '@/constants/routes';
import { useState, useRef, useLayoutEffect, useEffect } from 'react';
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
  const queryClient = useQueryClient();
  const { mutateAsync: deleteTableGroup } = useDeleteTableGroup();

  const [isAddTableGroupDialogOpen, setIsAddTableGroupDialogOpen] =
    useState(false);

  const [isEditTableGroupDialogOpen, setIsEditTableGroupDialogOpen] =
    useState(false);

  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);

  const [buttonPosition, setButtonPosition] = useState<
    'default' | 'bottom' | 'top'
  >('default');

  // useState는 값 변경 시 리렌더링 유발하지만, useRef는 UI에 반영 X, 내부 로직에서만 사용
  //길게 누르기 타이머 ID를 저장하는 ref
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 길게 누르기가 발생했는지 추적하는 boolean 값
  const isLongPressRef = useRef(false);

  const tableGroupListRef = useRef<HTMLUListElement>(null);
  const editDeleteButtonsRef = useRef<HTMLDivElement>(null);
  const editTableGroupDialogRef = useRef<HTMLDivElement>(null);
  // 길게 누르기가 발생했을 때 처리하는 함수
  const handleLongPressStart = (group: ITableGroup) => {
    isLongPressRef.current = false; // 이전 길게 누르기 상태 초기화
    longPressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      setEditingGroupId(group.tableGroupSeq);
      onTableGroupSelect(group.tableGroupSeq); // 길게 누른 그룹을 선택 상태로 변경
    }, 500);
  };

  const handleLongPressEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleItemClick = (group: ITableGroup) => {
    handleLongPressEnd();
    if (!isLongPressRef.current) {
      // 다른 그룹을 클릭한 경우 수정/삭제 버튼 숨김
      if (editingGroupId !== null && editingGroupId !== group.tableGroupSeq) {
        setEditingGroupId(null);
      }
      onTableGroupSelect(group.tableGroupSeq);
    }
    isLongPressRef.current = false;
  };

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
            // TODO: 추후에 shopSeq 추가
            shopSeq: 1,
            tableGroupSeq: group.tableGroupSeq,
          },
          {
            onSuccess: async () => {
              await queryClient.invalidateQueries({
                // TODO: 추후에 shopCode 추가
                queryKey: queryKeys.table.groupList('NEXA000001'),
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

  const calculateButtonPosition = (groupId: number | null) => {
    //수정하려는 테이블 그룹 인덱스 찾기
    const currentIndex = tableGroups.findIndex(
      (g) => g.tableGroupSeq === groupId
    );
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === tableGroups.length - 1;

    if (isFirst) {
      return 'bottom';
    } else if (isLast) {
      return 'top';
    } else {
      return 'default';
    }
  };

  /**
   * 첫 번째 요소랑 마지막 요소 위치 조정함
   *
   * useLayoutEffect를 사용하여 DOM 업데이트 전에 위치를 계산함
   *
   * handleLongPressStart에서도 위치를 계산하지만,
   * editingGroupId가 변경될 때마다 다시 계산하여 정확성 높임
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
            <S.TableGroupItemWrapper key={group.tableGroupSeq}>
              <S.TableGroupItem
                onClick={() => handleItemClick(group)}
                onMouseDown={() => handleLongPressStart(group)}
                onMouseUp={handleLongPressEnd}
                onMouseLeave={handleLongPressEnd}
                onTouchStart={() => handleLongPressStart(group)}
                onTouchEnd={handleLongPressEnd}
                isSelected={selectedTableGroupId === group.tableGroupSeq}
              >
                {group.tableGroupName}
              </S.TableGroupItem>
              {editingGroupId === group.tableGroupSeq && (
                <S.EditDeleteButtons
                  ref={editDeleteButtonsRef}
                  buttonPosition={buttonPosition}
                  onClick={(e) => e.stopPropagation()}
                >
                  <S.EditButton onClick={() => handleEdit(group)} type="button">
                    <EditIcon width={32} height={32} color={colors.grey[700]} />
                  </S.EditButton>
                  <S.DeleteButton
                    onClick={() => handleDelete(group)}
                    type="button"
                  >
                    <DeleteIcon
                      width={32}
                      height={32}
                      color={colors.grey[700]}
                    />
                  </S.DeleteButton>
                </S.EditDeleteButtons>
              )}
            </S.TableGroupItemWrapper>
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
