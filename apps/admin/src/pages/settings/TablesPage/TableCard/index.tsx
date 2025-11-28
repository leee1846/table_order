'use client';

import { BasicButton } from '@repo/ui/components';
import { toast } from '@repo/feature/utils';
import * as S from './tableCard.styles';
import { type TableInfoData } from '@/constants/mock';
import { css } from '@emotion/react';
import { theme } from '@repo/ui';
import { useState } from 'react';
import { EditTableDialog } from '../dialogs/EditTableDialog';
import { openDualActionDialog } from '@repo/feature/utils';
const { colors } = theme;

interface Props {
  table: TableInfoData;
}

export const TableCard = ({ table }: Props) => {
  const [isTableEditDialogOpen, setIsTableEditDialogOpen] = useState(false);
  const handleEdit = () => {
    setIsTableEditDialogOpen(true);
  };
  const handleDelete = () => {
    openDualActionDialog({
      title: '정말 테이블을 삭제하시겠습니까?',
      content: `테이블 명 : ${table.tableName}`,
      primaryText: '확인',
      secondaryText: '취소',
      size: 'xsmall',
      onConfirm: () => {
        // TODO: 테이블 삭제 기능 구현
        toast('테이블이 삭제되었습니다.');
      },
    });
  };
  const handleCloseDialog = () => {
    setIsTableEditDialogOpen(false);
  };
  const handleSubmit = (_tableName: string) => {
    // TODO: API 호출로 테이블 정보 업데이트
  };
  return (
    <>
      <S.TableCard>
        <S.TableContent>
          <S.TableName>{table.tableName}</S.TableName>
          <S.TableStatus>빈테이블</S.TableStatus>
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
        onSubmit={handleSubmit}
        table={table}
      />
    </>
  );
};
