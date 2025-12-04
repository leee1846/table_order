import { useState } from 'react';
import { ModalBackground, Input, BasicButton } from '@repo/ui/components';
import { CloseIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from './addTableGroupDialog.styles';
import { toast } from '@repo/feature/utils';
import { createTableGroup } from '@repo/api/fetchers';
import { useQueryClient } from '@repo/api/tanstack-query';
import { queryKeys } from '@repo/api/queries';
const { colors } = theme;

interface AddTableGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTableGroupDialog = ({
  isOpen,
  onClose,
}: AddTableGroupDialogProps) => {
  const queryClient = useQueryClient();
  const [groupName, setGroupName] = useState('');

  const handleSubmit = async () => {
    if (groupName.trim() !== '') {
      try {
        await createTableGroup({
          // TODO: 추후에 shopSeq 추가
          shopSeq: 1,
          tableGroupName: groupName,
        });
        // POST 요청이 성공(200)한 후에 조회 쿼리 무효화
        await queryClient.invalidateQueries({
          // TODO: 추후에 shopCode 추가
          queryKey: queryKeys.table.groupList('NEXA000001'),
        });

        toast('테이블 그룹이 추가되었습니다.');
        handleClose();
      } catch (error) {
        toast('테이블 그룹 추가에 실패했습니다.');
      }
    }
  };

  const handleClose = () => {
    setGroupName('');
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <ModalBackground onClick={handleClose}>
      <S.ModalContainer>
        <S.CloseButton onClick={handleClose} type="button">
          <CloseIcon width={32} height={32} color={colors.grey[600]} />
        </S.CloseButton>
        <S.ModalHeader>
          <S.ModalTitle>테이블 그룹 추가</S.ModalTitle>
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
            추가하기
          </BasicButton>
        </S.ModalFooter>
      </S.ModalContainer>
    </ModalBackground>
  );
};
