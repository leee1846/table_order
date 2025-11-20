import { useState } from 'react';
import {
  ModalBackground,
  Input,
  BasicButton,
  toast,
} from '@repo/ui/components';
import { CloseIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from './addTableGroupDialog.styles';

const { colors } = theme;

interface AddTableGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (groupName: string) => void;
}

export const AddTableGroupDialog = ({
  isOpen,
  onClose,
  onSubmit,
}: AddTableGroupDialogProps) => {
  const [groupName, setGroupName] = useState('');

  const handleSubmit = () => {
    if (groupName.trim()) {
      onSubmit(groupName.trim());
      setGroupName('');
      onClose();
    }
    toast('테이블 그룹이 추가되었습니다.');
  };

  const handleClose = () => {
    setGroupName('');
    onClose();
  };

  if (!isOpen){ return null;}

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
