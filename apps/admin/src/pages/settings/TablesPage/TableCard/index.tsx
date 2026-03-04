'use client';
import * as S from './tableCard.styles';
import { type ITableInfo } from '@repo/api/types';

interface Props {
  table: ITableInfo;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const TableCard = ({ table, isSelected, onSelect }: Props) => {
  return (
    <S.TableCard 
      onClick={onSelect}
      isSelected={isSelected}
    >
      <S.TableContent>
        <S.TableName>{table.tableName || table.tableNumber}</S.TableName>
      </S.TableContent>
    </S.TableCard>
  );
};
