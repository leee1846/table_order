import { t } from '@/config/i18n';
import { useState, useEffect, forwardRef } from 'react';
import { ModalBackground, Input, BasicButton } from '@repo/ui/components';
import { CloseIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from './editTableGroupDialog.styles';
import { toast } from '@repo/feature/utils';
import { useQueryClient } from '@repo/api/tanstack-query';
import { queryKeys, usePutUpdateTableGroup } from '@repo/api/queries';
import type { ITableGroup } from '@repo/api/types';
import { useAuth } from '@/hooks/useAuth';
const { colors } = theme;

interface EditTableGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tableGroup: ITableGroup;
}

export const EditTableGroupDialog = forwardRef<
  HTMLDivElement,
  EditTableGroupDialogProps
>(({ isOpen, onClose, tableGroup }, ref) => {
  const queryClient = useQueryClient();
  const { mutateAsync: updateTableGroup } = usePutUpdateTableGroup();
  const [groupName, setGroupName] = useState('');
  const { shopCode } = useAuth();

  useEffect(() => {
    if (tableGroup) {
      setGroupName(tableGroup.tableGroupName);
    }
  }, [tableGroup]);

  const handleSubmit = async () => {
    if (!tableGroup) {
      return;
    }

    if (groupName.trim() !== '') {
      await updateTableGroup({
        tableGroupSeq: tableGroup.tableGroupSeq,
        tableGroupName: groupName,
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.table.groupList(shopCode!),
      });

      toast(t('테이블 그룹이 수정되었습니다.'));
      handleClose();
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
      <S.ModalContainer ref={ref}>
        <S.ButtonWrapper>
          <S.CloseButton onClick={handleClose} type="button">
            <CloseIcon width={32} height={32} color={colors.grey[600]} />
          </S.CloseButton>
        </S.ButtonWrapper>
        <S.ModalHeader>
          <S.ModalTitle>{t('테이블 그룹 수정')}</S.ModalTitle>
        </S.ModalHeader>
        <S.ModalBody>
          <Input
            value={groupName}
            onChange={setGroupName}
            placeholder={t('테이블 그룹 이름을 입력하세요')}
          />
        </S.ModalBody>
        <S.ModalFooter>
          <BasicButton
            variant="Solid_Navy_2XL"
            onClick={handleSubmit}
            customStyle={S.SubmitButton}
          >
            {t('수정하기')}
          </BasicButton>
        </S.ModalFooter>
      </S.ModalContainer>
    </ModalBackground>
  );
});

EditTableGroupDialog.displayName = 'EditTableGroupDialog';
