import { useState, useEffect } from 'react';
import { ModalBackground, Input, BasicButton } from '@repo/ui/components';
import { CloseIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { type TableInfoData } from '@/constants/mock';
import * as S from './editTableDialog.styles';

const { colors } = theme;

interface EditTableDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tableName: string) => void;
  table: TableInfoData;
}

export const EditTableDialog = ({
  isOpen,
  onClose,
  onSubmit,
  table,
}: EditTableDialogProps) => {
  const [tableName, setTableName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTableName(table.tableName);
    }
  }, [isOpen, table.tableName]);

  const handleSubmit = () => {
    if (tableName.trim()) {
      onSubmit(tableName.trim());
      onClose();
    }
  };

  const handleClose = () => {
    setTableName('');
    onClose();
  };

  if (!isOpen) {return null;}

  return (
    <ModalBackground onClick={handleClose}>
      <S.ModalContainer>
        <S.CloseButton onClick={handleClose} type="button">
          <CloseIcon width={32} height={32} color={colors.grey[600]} />
        </S.CloseButton>
        <S.ModalHeader>
          <S.ModalTitle>{table.tableName} 테이블 수정</S.ModalTitle>
        </S.ModalHeader>
        <S.ModalBody>
          <S.InputWrapper>
            <S.Label>테이블 이름</S.Label>
            <Input
              value={tableName}
              onChange={setTableName}
              placeholder={table.tableName}
            />
          </S.InputWrapper>
          <S.InputWrapper>
            <S.Label>테이블 ID</S.Label>
            <Input
              value={table.id.toString()}
              onChange={() => {}}
              disabled
              errorMessage="테이블 ID는 자동 생성되며. 임의 수정이 불가능해요."
            />
          </S.InputWrapper>
        </S.ModalBody>
        <S.ModalFooter>
          <BasicButton
            variant="Solid_Navy_2XL"
            onClick={handleSubmit}
            customStyle={S.SubmitButton}
          >
            저장하기
          </BasicButton>
        </S.ModalFooter>
      </S.ModalContainer>
    </ModalBackground>
  );
};
