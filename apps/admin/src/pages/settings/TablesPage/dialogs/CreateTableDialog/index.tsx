import { t } from '@/config/i18n';
import { useState } from 'react';
import { ModalBackground, Input, BasicButton } from '@repo/ui/components';
import { CloseIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from './createTableDialog.styles';

const { colors } = theme;

interface CreateTableDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tableName: string) => void | Promise<void>;
}

export const CreateTableDialog = ({
  isOpen,
  onClose,
  onSubmit,
}: CreateTableDialogProps) => {
  const [tableName, setTableName] = useState('');

  const handleSubmit = async () => {
    if (tableName.trim()) {
      await onSubmit(tableName.trim());
      onClose();
    }
  };

  const handleClose = () => {
    setTableName('');
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
          <S.ModalTitle>
            {t('테이블 추가')}
          </S.ModalTitle>
        </S.ModalHeader>
        <S.ModalBody>
          <S.InputWrapper>
            <S.Label>{t('테이블 이름')}</S.Label>
            <Input
              value={tableName}
              onChange={setTableName}
              placeholder={t('테이블 이름')}
            />
          </S.InputWrapper>
          <S.InputWrapper>
            <S.Label>{t('테이블 ID')}</S.Label>
            <Input
              value={''}
              onChange={() => {}}
              disabled
              errorMessage={t(
                '테이블 ID는 자동으로 생성돼요.'
              )}
            />
          </S.InputWrapper>
        </S.ModalBody>
        <S.ModalFooter>
          <BasicButton
            variant="Solid_Navy_2XL"
            onClick={handleSubmit}
            customStyle={S.SubmitButton}
          >
            {t('저장하기')}
          </BasicButton>
        </S.ModalFooter>
      </S.ModalContainer>
    </ModalBackground>
  );
};
