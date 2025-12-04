import { useState, useEffect } from 'react';
import { ModalBackground, Input, BasicButton } from '@repo/ui/components';
import { CloseIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from './editTableGroupDialog.styles';
import { toast } from '@repo/feature/utils';
import { updateTableGroup } from '@repo/api/fetchers';
import { useQueryClient } from '@repo/api/tanstack-query';
import { queryKeys } from '@repo/api/queries';
import type { ITableGroup } from '@repo/api/types';
const { colors } = theme;

interface EditTableGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tableGroup: ITableGroup;
}

export const EditTableGroupDialog = ({
  isOpen,
  onClose,
  tableGroup,
}: EditTableGroupDialogProps) => {
  const queryClient = useQueryClient();
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    if (tableGroup) {
      setGroupName(tableGroup.tableGroupName);
    }
  }, [tableGroup]);

  const handleSubmit = async () => {
    if (!tableGroup) return;

    if (groupName.trim() !== '') {
      try {
        await updateTableGroup({
          // TODO: 추후에 shopSeq 추가
          shopSeq: 1,
          tableGroupSeq: tableGroup.tableGroupSeq,
          tableGroupName: groupName,
        });

        await queryClient.invalidateQueries({
          // TODO: 추후에 shopCode 추가
          queryKey: queryKeys.table.groupList('NEXA000001'),
        });

        toast('테이블 그룹이 수정되었습니다.');
        handleClose();
      } catch (error) {
        toast('테이블 그룹 수정에 실패했습니다.');
      }
    }
  };

  const handleClose = () => {
    setGroupName('');
    onClose();
  };

  if (!isOpen || !tableGroup) {
    return null;
  }

  return (
    <ModalBackground onClick={handleClose}>
      <S.ModalContainer>
        <S.CloseButton onClick={handleClose} type="button">
          <CloseIcon width={32} height={32} color={colors.grey[600]} />
        </S.CloseButton>
        <S.ModalHeader>
          <S.ModalTitle>테이블 그룹 수정</S.ModalTitle>
        </S.ModalHeader>
        <S.ModalBody>
          <Input
            value={groupName}
            onChange={setGroupName}
            placeholder="테이블 그룹 이름을 입력하세요"
          />
        </S.ModalBody>
        <S.ModalFooter>
          <BasicButton
            variant="Solid_Navy_2XL"
            onClick={handleSubmit}
            customStyle={S.SubmitButton}
          >
            수정하기
          </BasicButton>
        </S.ModalFooter>
      </S.ModalContainer>
    </ModalBackground>
  );
};
