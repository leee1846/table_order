'use client';

import { useDraggable, useDroppable, CSS } from '../../hooks';
import type { i18n as I18nInstance } from 'i18next';
import { TableWithStatus } from '../TablesPageContainer/types';
import { TableCard } from '../TableCard';
import * as S from './draggableTableCard.styles';

interface DraggableTableCardProps {
  table: TableWithStatus;
  activeTableNumber?: string | null;
  onClick: (table: TableWithStatus) => void;
  i18nInstance?: I18nInstance;
}

export const DraggableTableCard = ({
  table,
  activeTableNumber,
  onClick,
  i18nInstance,
}: DraggableTableCardProps) => {
  const tableNumber = String(table.tableNumber);
  const hasOrder = table.menuItems !== null && table.menuItems !== undefined;
  const isActive = activeTableNumber === tableNumber;

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
    isDragging,
  } = useDraggable({
    id: tableNumber,
    disabled: !hasOrder,
  });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: tableNumber,
  });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined;

  const combinedRef = (node: HTMLDivElement | null) => {
    setDraggableRef(node);
    setDroppableRef(node);
  };

  return (
    <S.DraggableCard
      ref={combinedRef}
      style={style}
      isActive={isActive}
      isOver={isOver}
      isDragging={isDragging}
      hasOrder={hasOrder}
      isOverTarget={isOver && !isDragging}
      {...attributes}
      {...(hasOrder ? listeners : {})}
    >
      <TableCard
        id={table.id}
        table={table}
        tableNumber={table.tableNumber}
        orderTime={table.orderTime ?? null}
        i18nInstance={i18nInstance}
        onClick={() => onClick(table)}
      />
    </S.DraggableCard>
  );
};
