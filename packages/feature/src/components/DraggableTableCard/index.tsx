'use client';

import { useDraggable, useDroppable, CSS } from '../../hooks';
import { useTranslation } from 'react-i18next';
import { TableWithStatus } from '../TablesPageContainer/types';
import { TableCard } from '../TableCard';
import * as S from './draggableTableCard.styles';

interface DraggableTableCardProps {
  table: TableWithStatus;
  activeTableNumber?: string | null;
  onClick: (table: TableWithStatus) => void;
  useTranslation: typeof useTranslation;
}

export const DraggableTableCard = ({
  table,
  activeTableNumber,
  onClick,
  useTranslation,
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
        useTranslation={useTranslation}
        onClick={() => onClick(table)}
      />
    </S.DraggableCard>
  );
};
