'use client';
import { t } from '@/config/i18n';
import { EditTableDialog } from '@/pages/settings/TablesPage/dialogs/EditTableDialog';
import { toast, openDualActionDialog } from '@repo/feature/utils';
import * as S from '@/pages/settings/TablesPage/BottomActions/bottomActions.styles';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useState } from 'react';
import type { ITableInfo } from '@repo/api/types';
import { useDeleteTable, queryKeys } from '@repo/api/queries';
import { useQueryClient } from '@repo/api/tanstack-query';

interface Props {
  onAddTable: () => void;
  isPosLinked: boolean;
  table: ITableInfo | null;
  shopCode: string;
}

export const BottomActions = ({
  onAddTable,
  isPosLinked,
  table,
  shopCode,
}: Props) => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { mutateAsync: deleteTable } = useDeleteTable();

  const [isTableEditDialogOpen, setIsTableEditDialogOpen] = useState(false);

  const handleExit = () => {
    navigate(ROUTES.SETTINGS.NOTICES.generate());
  };

  // 테이블 수정
  const handleEdit = () => {
    setIsTableEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsTableEditDialogOpen(false);
  };

  // 테이블 삭제
  const handleDelete = () => {
    if (!table) {
      return;
    }
    openDualActionDialog({
      title: t('정말 테이블을 삭제하시겠습니까?'),
      content: `테이블 명 : ${table?.tableName || table?.tableNumber}`,
      primaryText: t('확인'),
      secondaryText: t('취소'),
      size: 'xsmall',
      onConfirm: async () => {
        await deleteTable({
          shopSeq: table?.shopSeq ?? 0,
          tableNumber: table?.tableNumber ?? '',
        });
        await queryClient.invalidateQueries({
          queryKey: queryKeys.table.groupList(shopCode),
        });
        toast(t('테이블이 삭제되었습니다.'));
      },
    });
  };

  return (
    <>
      <S.BottomActionsContainer>
        <button onClick={handleExit}>{t('나가기')}</button>
        <button onClick={handleEdit}>{t('수정')}</button>
        <button onClick={handleDelete} disabled={isPosLinked}>
          {t('삭제')}
        </button>
        <button onClick={onAddTable} disabled={isPosLinked}>
          {t('테이블 추가')}
        </button>
      </S.BottomActionsContainer>
      {table && (
        <EditTableDialog
          isOpen={isTableEditDialogOpen}
          onClose={handleCloseDialog}
          table={table}
          shopCode={shopCode}
        />
      )}
    </>
  );
};
