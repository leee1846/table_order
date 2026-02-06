import { t } from '@/config/i18n';
import { useState, useEffect } from 'react';
import { ModalBackground, Input, BasicButton } from '@repo/ui/components';
import { CloseIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { type ITableInfo } from '@repo/api/types';
import { usePutUpdateTable, queryKeys } from '@repo/api/queries';
import { useQueryClient } from '@repo/api/tanstack-query';
import { toast } from '@repo/feature/utils';
import { MAX_TABLE_GROUP_NAME_LENGTH } from '@repo/util/constants';
import * as S from './editTableDialog.styles';

const { colors } = theme;

interface EditTableDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (tableName: string) => void | Promise<void>;
  table: ITableInfo;
  shopCode: string;
}

export const EditTableDialog = ({
  isOpen,
  onClose,
  onSubmit,
  table,
  shopCode,
}: EditTableDialogProps) => {
  const queryClient = useQueryClient();
  const { mutateAsync: updateTable } = usePutUpdateTable();
  const [tableName, setTableName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTableName(table.tableName || table.tableNumber);
    }
  }, [isOpen, table.tableName, table.tableNumber]);

  const handleSubmit = async () => {
    if (!tableName.trim()) {
      toast(t('테이블 이름을 입력해주세요.'));
      return;
    }

    try {
      await updateTable({
        tableSeq: table.tableSeq,
        tableName: tableName.trim(),
        tablePositionX: table.tablePositionX,
        tablePositionY: table.tablePositionY,
      });

      toast(t('테이블이 수정되었습니다.'));
      queryClient.invalidateQueries({
        queryKey: queryKeys.table.groupList(shopCode),
      });

      if (onSubmit) {
        await onSubmit(tableName.trim());
      }

      onClose();
    } catch (error) {
      toast(t('테이블 수정 중 오류가 발생했습니다.'));
      console.error(t('테이블 수정 오류:'), error);
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
          <S.ModalTitle>{t('테이블 수정')}</S.ModalTitle>
        </S.ModalHeader>
        <S.ModalBody>
          <S.InputWrapper>
            <S.Label>{t('테이블 이름')}</S.Label>
            <Input
              value={tableName}
              onChange={(value) => {
                if (value.length <= MAX_TABLE_GROUP_NAME_LENGTH) {
                  setTableName(value);
                }
              }}
              placeholder={table.tableName || table.tableNumber}
            />
          </S.InputWrapper>
          <S.InputWrapper>
            <S.Label>{t('테이블 ID')}</S.Label>
            <Input
              value={table.tableSeq.toString()}
              onChange={() => {
                // 테이블 ID는 수정 불가
              }}
              disabled
              errorMessage={t(
                '테이블 ID는 자동 생성되며. 임의 수정이 불가능해요.'
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
