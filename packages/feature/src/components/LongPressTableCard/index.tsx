'use client';

import { useTranslation } from 'react-i18next';
import { useLongPress } from '../../hooks';
import { TableWithStatus } from '../TablesPageContainer/types';
import { TableCard } from '../TableCard';
import * as S from './longPressTableCard.styles';

interface LongPressTableCardProps {
  table: TableWithStatus;
  onClick: (table: TableWithStatus) => void;
  onLongPress?: (table: TableWithStatus) => void;
  useTranslation: typeof useTranslation;
  longPressDelay?: number;
}

export const LongPressTableCard = ({
  table,
  onClick,
  onLongPress,
  useTranslation,
  longPressDelay = 500,
}: LongPressTableCardProps) => {
  const { handlers } = useLongPress({
    delay: longPressDelay,
    onClick: () => onClick(table),
    onLongPress: onLongPress ? () => onLongPress(table) : undefined,
  });

  return (
    <S.LongPressCard {...handlers}>
      <TableCard
        id={table.id}
        table={table}
        tableNumber={table.tableNumber}
        orderTime={table.orderTime ?? null}
        useTranslation={useTranslation}
      />
    </S.LongPressCard>
  );
};
