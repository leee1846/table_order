import { t } from '@/config/i18n';
import { useState, useCallback } from 'react';
import { type DragEndEvent, type DragStartEvent } from '@repo/feature/hooks';
import {
  queryKeys,
  usePutMoveOrderTable,
  usePutShareOrderTable,
} from '@repo/api/queries';
import { useQueryClient } from '@repo/api/tanstack-query';
import { toast } from '@repo/feature/utils';

type TableWithStatus = {
  tableNumber: string;
  hasOrder: boolean;
};

interface UseTableDragProps {
  tableMap: Map<string, TableWithStatus>;
  shopCode: string | null;
}

interface UseTableDragReturn {
  activeTableNumber: string | null;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragCancel: () => void;
  handleDragEnd: (event: DragEndEvent) => void;
}

/**
 * 테이블 드래그 앤 드롭 기능을 관리하는 커스텀 훅
 * - 드래그 시작/취소/종료 이벤트 처리
 * - 주문 이동 및 합석 기능
 *
 * @param props - 테이블 맵과 매장 코드
 * @returns 드래그 상태 및 핸들러 함수들
 */
export const useTableDrag = ({
  tableMap,
  shopCode,
}: UseTableDragProps): UseTableDragReturn => {
  const [activeTableNumber, setActiveTableNumber] = useState<string | null>(
    null
  );
  const queryClient = useQueryClient();
  const moveOrderMutation = usePutMoveOrderTable();
  const shareOrderMutation = usePutShareOrderTable();

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveTableNumber(String(event.active.id));
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveTableNumber(null);
  }, []);

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      setActiveTableNumber(null);

      if (!over || !shopCode) {
        return;
      }

      const sourceId = String(active.id);
      const targetId = String(over.id);

      if (sourceId === targetId) {
        return;
      }

      const sourceTable = tableMap.get(sourceId);
      const targetTable = tableMap.get(targetId);

      if (!sourceTable || !targetTable || !sourceTable.hasOrder) {
        return;
      }

      const payload = {
        shopCode,
        originalTableNumber: sourceId,
        targetTableNumber: targetId,
      };

      if (!targetTable.hasOrder) {
        moveOrderMutation.mutate(payload, {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: queryKeys.orders.currentTableList(shopCode),
            });
            toast(t('주문을 이동했어요.'));
          },
        });
        return;
      }

      shareOrderMutation.mutate(payload, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: queryKeys.orders.currentTableList(shopCode),
          });
          toast(t('주문을 합석했어요.'));
        },
      });
    },
    [moveOrderMutation, queryClient, shareOrderMutation, shopCode, tableMap]
  );

  return {
    activeTableNumber,
    handleDragStart,
    handleDragCancel,
    handleDragEnd,
  };
};
