import { useCallback } from 'react';
import {
  TableCard,
  type TableData,
  useTranslation,
} from '@repo/feature/components';
import {
  useDraggable,
  useDroppable,
  useDndContext,
  CSS,
} from '@repo/feature/hooks';
import * as S from './draggableTableCard.style';

export type TableWithStatus = TableData & {
  hasOrder: boolean;
};

interface DraggableTableCardProps {
  table: TableWithStatus;
  activeTableNumber: string | null;
  onClick: (table: TableWithStatus) => void;
  useTranslation: typeof useTranslation;
}

export const DraggableTableCard = ({
  table,
  activeTableNumber,
  onClick,
  useTranslation,
}: DraggableTableCardProps) => {
  const draggableId = String(table.tableNumber);

  //dnd-kit 사용해서 카드를 드래그 앤 드롭 가능하게 만듦
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: draggableId,
      disabled: !table.hasOrder,
    });

  const { isOver, setNodeRef: setDroppableRef } = useDroppable({
    id: draggableId,
  });

  const { over } = useDndContext();

  const setRefs = useCallback(
    (node: HTMLElement | null) => {
      setNodeRef(node);
      setDroppableRef(node);
    },
    [setDroppableRef, setNodeRef]
  );

  const handleClick = () => {
    if (isDragging || activeTableNumber) {
      return;
    }
    onClick(table);
  };

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined;

  const isActive = activeTableNumber === draggableId;
  const isOverTarget = isDragging && over != null && over.id !== draggableId;

  return (
    <S.DraggableCard
      ref={setRefs}
      style={style}
      isActive={isActive}
      isOver={isOver && activeTableNumber !== draggableId}
      isDragging={isDragging}
      hasOrder={table.hasOrder}
      isOverTarget={isOverTarget}
      {...listeners}
      {...attributes}
    >
      <TableCard
        id={table.id}
        tableNumber={table.tableNumber}
        onClick={handleClick}
        batteryLevel={table.batteryLevel}
        totalAmount={table.totalAmount ?? null}
        orderTime={table.orderTime ?? null}
        menuItems={table.menuItems ?? null}
        useTranslation={useTranslation}
      />
    </S.DraggableCard>
  );
};
