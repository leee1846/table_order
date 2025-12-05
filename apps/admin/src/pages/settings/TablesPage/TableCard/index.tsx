'use client';

import { BasicButton } from '@repo/ui/components';
import { toast } from '@repo/feature/utils';
import * as S from './tableCard.styles';
import { type ITableInfo } from '@repo/api/types';
import { css } from '@emotion/react';
import { theme } from '@repo/ui';
import { useState } from 'react';
import { EditTableDialog } from '../dialogs/EditTableDialog';
import { openDualActionDialog } from '@repo/feature/utils';
import { useQueryClient } from '@repo/api/tanstack-query';
import { useDeleteTable, queryKeys } from '@repo/api/queries';
const { colors } = theme;

interface Props {
  table: ITableInfo;
  shopCode: string;
}

export const TableCard = ({ table, shopCode }: Props) => {
  const queryClient = useQueryClient();
  const { mutateAsync: deleteTable } = useDeleteTable();
  const [isTableEditDialogOpen, setIsTableEditDialogOpen] = useState(false);
  const handleEdit = () => {
    setIsTableEditDialogOpen(true);
  };
  const handleDelete = () => {
    openDualActionDialog({
      title: '정말 테이블을 삭제하시겠습니까?',
      content: `테이블 명 : ${table.tableName || table.tableNumber}`,
      primaryText: '확인',
      secondaryText: '취소',
      size: 'xsmall',
      onConfirm: async () => {
        try {
          await deleteTable({
            tableSeq: table.tableSeq,
            shopSeq: table.shopSeq,
            tableNumber: table.tableNumber,
          });
          await queryClient.invalidateQueries({
            queryKey: queryKeys.table.groupList(shopCode),
          });
          toast('테이블이 삭제되었습니다.');
        } catch (error) {
          toast('테이블 삭제에 실패했습니다.');
        }
      },
    });
  };
  const handleCloseDialog = () => {
    setIsTableEditDialogOpen(false);
  };
  return (
    <>
      <S.TableCard>
        <S.TableContent>
          <S.TableName>{table.tableName || table.tableNumber}</S.TableName>
        </S.TableContent>
        <S.ButtonWrapper>
          <BasicButton
            variant="Solid_Grey_L"
            onClick={handleEdit}
            customStyle={css`
              ${S.Button}
              border-right: 1px solid ${colors.grey[300]};
            `}
          >
            수정
          </BasicButton>
          <BasicButton
            variant="Solid_Sky_Blue_L"
            customStyle={S.Button}
            onClick={handleDelete}
          >
            삭제
          </BasicButton>
        </S.ButtonWrapper>
      </S.TableCard>
      <EditTableDialog
        isOpen={isTableEditDialogOpen}
        onClose={handleCloseDialog}
        table={table}
        shopCode={shopCode}
      />
    </>
  );
};
