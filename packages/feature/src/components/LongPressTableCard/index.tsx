'use client';

import type { i18n as I18nInstance } from 'i18next';
import { useLongPress } from '../../hooks';
import { TableWithStatus } from '../TablesPageContainer/types';
import { TableCard } from '../TableCard';
import * as S from './longPressTableCard.styles';

interface LongPressTableCardProps {
  table: TableWithStatus;
  onClick: (table: TableWithStatus) => void;
  onLongPress?: (table: TableWithStatus) => void;
  i18nInstance?: I18nInstance;
  longPressDelay?: number;
}

export const LongPressTableCard = ({
  table,
  onClick,
  onLongPress,
  i18nInstance,
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
        wifiSignal={table.wifiSignal ?? null}
        id={table.id}
        table={table}
        tableNumber={table.tableNumber}
        orderTime={table.orderTime ?? null}
        i18nInstance={i18nInstance}
      />
    </S.LongPressCard>
  );
};
