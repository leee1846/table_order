import { EditIcon, DeleteIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { useLongPress } from '@repo/feature/utils';
import { useRef } from 'react';
import type { ITableGroup } from '@repo/api/types';
import * as S from './sidebar.styles';

const { colors } = theme;

export interface TableGroupItemProps {
  group: ITableGroup;
  isSelected: boolean;
  isEditing: boolean;
  buttonPosition: 'default' | 'bottom' | 'top';
  editingGroupId: number | null;
  onSelect: (groupId: number) => void;
  onEdit: () => void;
  onDelete: () => void;
  onEditingChange: (groupId: number | null) => void;
}

export const TableGroupItem = ({
  group,
  isSelected,
  isEditing,
  buttonPosition,
  editingGroupId,
  onSelect,
  onEdit,
  onDelete,
  onEditingChange,
}: TableGroupItemProps) => {
  const editDeleteButtonsRef = useRef<HTMLDivElement>(null);

  const longPressHandlers = useLongPress({
    delay: 500,
    onLongPress: () => {
      onEditingChange(group.tableGroupSeq);
      onSelect(group.tableGroupSeq);
    },
    onClick: () => {
      // 다른 그룹을 클릭한 경우 수정/삭제 버튼 숨김
      if (editingGroupId !== null && editingGroupId !== group.tableGroupSeq) {
        onEditingChange(null);
      }
      onSelect(group.tableGroupSeq);
    },
  });

  return (
    <S.TableGroupItemWrapper>
      <S.TableGroupItem {...longPressHandlers} isSelected={isSelected}>
        {group.tableGroupName}
      </S.TableGroupItem>
      {isEditing && (
        <S.EditDeleteButtons
          ref={editDeleteButtonsRef}
          buttonPosition={buttonPosition}
          onClick={(e) => e.stopPropagation()}
        >
          <S.EditButton onClick={onEdit} type="button">
            <EditIcon width={32} height={32} color={colors.grey[700]} />
          </S.EditButton>
          <S.DeleteButton onClick={onDelete} type="button">
            <DeleteIcon width={32} height={32} color={colors.grey[700]} />
          </S.DeleteButton>
        </S.EditDeleteButtons>
      )}
    </S.TableGroupItemWrapper>
  );
};
