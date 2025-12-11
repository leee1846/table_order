'use client';

import * as S from './tableGridContainer.styles';
import { TableCard } from './TableCard';
import { useTranslation } from 'react-i18next';

export interface TableData {
  id: number;
  tableNumber: number;
  batteryLevel: number;
  totalAmount?: number | null;
  orderTime?: string | null;
  menuItems?: Array<{ name: string; quantity: number }> | null;
}

interface Props {
  tables: TableData[];
  onTableClick?: (table: TableData) => void;
  useTranslation: typeof useTranslation;
}

export const TableGridContainer = ({
  useTranslation,
  tables,
  onTableClick,
}: Props) => {
  const { t } = useTranslation();

  const handleTableClick = (table: TableData) => {
    onTableClick?.(table);
  };

  return (
    <S.Wrapper>
      <S.GridContainer>
        {tables.length < 1 && (
          <S.NoContent>{t('테이블이 존재하지 않습니다.')}</S.NoContent>
        )}

        {tables.map((table) => (
          <TableCard
            id={table.id}
            key={table.id}
            tableNumber={table.tableNumber}
            onClick={() => handleTableClick(table)}
            batteryLevel={table.batteryLevel}
            totalAmount={table.totalAmount ?? null}
            orderTime={table.orderTime ?? null}
            menuItems={table.menuItems ?? null}
            useTranslation={useTranslation}
          />
        ))}
      </S.GridContainer>
    </S.Wrapper>
  );
};
