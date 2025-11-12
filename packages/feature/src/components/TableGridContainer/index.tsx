'use client';

import * as S from './tableGridContainer.styles';
import { TableCard } from './TableCard';

export interface TableData {
  id: number;
  tableNumber: number;
  batteryLevel: number;
  totalAmount?: number;
  orderTime?: string;
  menuItems?: Array<{ name: string; quantity: number }>;
}

interface Props {
  tables: TableData[];
  onTableClick?: (table: TableData) => void;
}

export const TableGridContainer = ({ tables, onTableClick }: Props) => {
  const handleTableClick = (table: TableData) => {
    onTableClick?.(table);
  };

  return (
    <S.Wrapper>
      <S.GridContainer>
        {tables.map((table) => (
          <TableCard
            id={table.id}
            key={table.id}
            tableNumber={table.tableNumber}
            onClick={() => handleTableClick(table)}
            batteryLevel={table.batteryLevel}
            totalAmount={table.totalAmount}
            orderTime={table.orderTime}
            menuItems={table.menuItems}
          />
        ))}
      </S.GridContainer>
    </S.Wrapper>
  );
};
