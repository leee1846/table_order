import { useState, useCallback } from 'react';

// 1. 객체(Record) 형태의 상태를 관리하는 드래그 앤 드롭 훅 (예: 탭별 파일 목록)
export const useRecordDragAndDrop = <T>(
  setRecordState: React.Dispatch<React.SetStateAction<Record<string, T[]>>>
) => {
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((index: number) => {
    setDraggedItemIndex(index);
  }, []);

  const handleDragEnter = useCallback(
    (index: number, tabKey: string) => {
      if (draggedItemIndex === null || draggedItemIndex === index) return;

      setRecordState((prev) => {
        const newItems = [...(prev[tabKey] || [])];
        const draggedItem = newItems[draggedItemIndex];
        newItems.splice(draggedItemIndex, 1);
        if (draggedItem) {
          newItems.splice(index, 0, draggedItem);
        }
        return { ...prev, [tabKey]: newItems };
      });
      setDraggedItemIndex(index);
    },
    [draggedItemIndex, setRecordState]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedItemIndex(null);
  }, []);

  return { handleDragStart, handleDragEnter, handleDragEnd };
};

// 2. 일반 배열(Array) 형태의 상태를 관리하는 드래그 앤 드롭 훅 (예: 메뉴 목록)
export const useListDragAndDrop = <T>(
  items: T[],
  onUpdateItems: (newItems: T[]) => void
) => {
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((index: number) => {
    setDraggedItemIndex(index);
  }, []);

  const handleDragEnter = useCallback(
    (index: number) => {
      if (draggedItemIndex === null || draggedItemIndex === index) return;

      const newItems = [...items];
      const draggedItem = newItems[draggedItemIndex];

      newItems.splice(draggedItemIndex, 1);
      if (draggedItem) {
        newItems.splice(index, 0, draggedItem);
      }
      setDraggedItemIndex(index);
      onUpdateItems(newItems);
    },
    [draggedItemIndex, items, onUpdateItems]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedItemIndex(null);
  }, []);

  return { handleDragStart, handleDragEnter, handleDragEnd };
};
