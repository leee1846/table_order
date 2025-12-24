import { type ReactNode } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor } from '../../hooks';
import type { DragEndEvent, DragStartEvent } from '../../hooks';

export interface DndContextWrapperProps {
  children: ReactNode;
  onDragStart?: (event: DragStartEvent) => void;
  onDragEnd?: (event: DragEndEvent) => void;
  onDragCancel?: () => void;
  longPressDelay?: number;
  longPressTolerance?: number;
}

export const DndContextWrapper = ({
  children,
  onDragStart,
  onDragEnd,
  onDragCancel,
  longPressDelay = 350,
  longPressTolerance = 8,
}: DndContextWrapperProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: longPressDelay,
        tolerance: longPressTolerance,
      },
    })
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      {children}
    </DndContext>
  );
};

