import { useState, useCallback } from 'react';
import { type DragEndEvent, type DragStartEvent } from '@repo/feature/hooks';
import {
  queryKeys,
  usePutMoveOrderTable,
  usePutShareOrderTable,
} from '@repo/api/queries';
import { useQueryClient } from '@repo/api/tanstack-query';
import { toast } from '@repo/feature/utils';
import { useCustomerCountStore } from '@/stores/useCustomerCountStore';

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
  const { data: customerCounts, setData, clearData } = useCustomerCountStore();
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
            const sourceCount = customerCounts[Number(sourceId)];
            if (sourceCount) {
              // 이동한 테이블에 기존 고객 수 저장
              setData(Number(targetId), {
                adultCount: sourceCount.adultCount,
                childCount: sourceCount.childCount ?? 0,
              });
            }
            clearData(Number(sourceId)); // 이동한 테이블 고객 수 초기화
            queryClient.invalidateQueries({
              queryKey: queryKeys.orders.currentTableList(shopCode),
            });
            toast('주문을 이동했어요.');
          },
          onError: () => {
            toast('테이블 이동에 실패했어요. 다시 시도해주세요.');
          },
        });
        return;
      }

      shareOrderMutation.mutate(payload, {
        onSuccess: () => {
          const sourceCount = customerCounts[Number(sourceId)]; // active 테이블 고객 수
          const targetCount = customerCounts[Number(targetId)]; // over 테이블 고객 수
          const adultCount =
            (targetCount?.adultCount ?? 0) + (sourceCount?.adultCount ?? 0);
          const childCount =
            (targetCount?.childCount ?? 0) + (sourceCount?.childCount ?? 0);

          // 합석 시 두 테이블의 객수를 합산해 저장하고, 원본 테이블은 초기화한다.
          setData(Number(targetId), {
            adultCount,
            childCount,
          });
          clearData(Number(sourceId));
          queryClient.invalidateQueries({
            queryKey: queryKeys.orders.currentTableList(shopCode),
          });
          toast('주문을 합석했어요.');
        },
        onError: () => {
          toast('주문 합석에 실패했어요. 다시 시도해주세요.');
        },
      });
    },
    [
      moveOrderMutation,
      queryClient,
      shareOrderMutation,
      shopCode,
      tableMap,
      customerCounts,
      setData,
      clearData,
    ]
  );

  return {
    activeTableNumber,
    handleDragStart,
    handleDragCancel,
    handleDragEnd,
  };
};
