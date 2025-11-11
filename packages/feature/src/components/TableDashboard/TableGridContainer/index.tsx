'use client';

import * as S from './tableGridContainer.styles';
import { TableCard } from '../TableCard';

export interface TableData {
  id: number;
  tableNumber: number;
  statusText: string;
  statusIcon?: React.ReactNode;
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
    <S.GridContainer>
      {tables.map((table) => (
        <TableCard
          key={table.id}
          tableNumber={table.tableNumber}
          statusText={table.statusText}
          statusIcon={table.statusIcon}
          onClick={() => handleTableClick(table)}
        />
      ))}
    </S.GridContainer>
  );
};
