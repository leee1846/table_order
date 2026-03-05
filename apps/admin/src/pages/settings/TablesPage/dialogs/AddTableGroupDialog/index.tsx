import { t } from '@/config/i18n';
import { useState } from 'react';
import { ModalBackground, Input, BasicButton } from '@repo/ui/components';
import { CloseIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from './addTableGroupDialog.styles';
import { toast } from '@repo/feature/utils';
import { useQueryClient } from '@repo/api/tanstack-query';
import { queryKeys, usePostCreateTableGroup } from '@repo/api/queries';
import { useAuth } from '@/hooks/useAuth';
import { MAX_TABLE_GROUP_NAME_LENGTH } from '@repo/util/constants';

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
  const { mutateAsync: createTableGroup } = usePostCreateTableGroup();

  const { shopCode, shopSeq } = useAuth();
  const handleSubmit = async () => {
    if (groupName.trim() === '') {
      toast(t('테이블 그룹 이름을 입력해주세요.'));
      return;
    }
    await createTableGroup({
      shopSeq: shopSeq ?? 0,
      tableGroupName: groupName.trim(),
    });

    await queryClient.invalidateQueries({
      queryKey: queryKeys.table.groupList(shopCode ?? ''),
    });

    toast(t('테이블 그룹이 추가되었습니다.'));
    handleClose();
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
        <S.ButtonWrapper>
          <S.CloseButton onClick={handleClose} type="button">
            <CloseIcon width={32} height={32} color={colors.grey[600]} />
          </S.CloseButton>
        </S.ButtonWrapper>
        <S.ModalHeader>
          <S.ModalTitle>{t('테이블 그룹 추가')}</S.ModalTitle>
        </S.ModalHeader>
        <S.ModalBody>
          <Input
            value={groupName}
            onChange={(value) => {
              if (value.length <= MAX_TABLE_GROUP_NAME_LENGTH) {
                setGroupName(value);
              }
            }}
            placeholder={t('테이블 그룹 이름을 입력해주세요')}
          />
        </S.ModalBody>
        <S.ModalFooter>
          <BasicButton
            variant="Solid_Navy_2XL"
            onClick={handleSubmit}
            customStyle={S.SubmitButton}
          >
            {t('추가하기')}
          </BasicButton>
        </S.ModalFooter>
      </S.ModalContainer>
    </ModalBackground>
  );
};
