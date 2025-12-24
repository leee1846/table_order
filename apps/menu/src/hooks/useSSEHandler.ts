import { useEffect } from 'react';
import { disconnectSse, initializeSseConnection } from '@/utils/sseConnection';
import { useSSE } from '@repo/feature/hooks';
import { SSE_KEYS } from '@/constants/keys';
import type { ISseMessage } from '@repo/api/types';
import { useTableOrderHistoriesData } from '@/hooks/useTableOrderHistoriesData';
import { useDeviceData } from '@/hooks/useDeviceData';
import { useShopData } from '@/hooks/useShopData';
import { useCategoriesData } from '@/hooks/useCategoriesData';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { useTableGroupData } from '@/hooks/useTableGroupData';
import { useQueryClient } from '@repo/api/tanstack-query';
import { queryKeys } from '@repo/api/queries';
import { usePickupAlarmStore } from '@/stores/usePickupAlarmStore';

/**
 * SSE 연결 및 메시지 처리를 담당하는 훅
 */
export const useSSEHandler = () => {
  // SSE 연결 초기화/해제
  useEffect(() => {
    initializeSseConnection();

    return () => {
      disconnectSse();
    };
  }, []);

  const queryClient = useQueryClient();

  // SSE 데이터 구독
  const { data: sseData } = useSSE.useSSEData<ISseMessage>(
    SSE_KEYS.MAIN_CONNECTION
  );

  // 필요한 데이터 훅들
  const { data: deviceData } = useDeviceData({ skipInitialRequest: true });
  const { shopData } = useShopData({ skipInitialRequest: true });
  const { refresh: refreshShopDetailData } = useShopDetailData({
    skipInitialRequest: true,
  });
  const {
    data: tableOrderHistoriesData,
    refresh: refreshTableOrderHistoriesData,
  } = useTableOrderHistoriesData({
    skipInitialRequest: true,
  });
  const { refresh: refreshCategoriesData } = useCategoriesData({
    skipInitialRequest: true,
  });
  const { refresh: refreshTableGroupData } = useTableGroupData({
    skipInitialRequest: true,
  });

  const { setData: setPickupAlarm } = usePickupAlarmStore();

  // SSE 메시지 처리
  useEffect(() => {
    const shopCode = shopData?.shopCode;

    if (!sseData || !deviceData || !shopData || !shopCode) {
      return;
    }

    if (sseData.shopCode !== shopData?.shopCode) {
      return;
    }

    switch (sseData.type) {
      case 'ORDER': {
        // TODO: 테스트 필요
        queryClient.refetchQueries({
          queryKey: queryKeys.orders.currentTableList(shopCode),
        });

        if (!sseData.data || !deviceData?.tableNumber) {
          return;
        }

        if (!(deviceData.tableNumber in sseData.data)) {
          if (
            tableOrderHistoriesData &&
            tableOrderHistoriesData !== 'isEmpty' &&
            tableOrderHistoriesData?.orderDetailMenuList?.length > 0
          ) {
            refreshTableOrderHistoriesData();
            break;
          }
          return;
        }

        const sseUpdatedAt = sseData.data[deviceData.tableNumber];

        if (
          // api 요청 했을경우
          tableOrderHistoriesData &&
          // 테이블을 점유 했을경우
          tableOrderHistoriesData !== 'isEmpty' &&
          // sse 업데이트 시간이 동일 (해당 테이블의 업데이트가 아닐경우)
          tableOrderHistoriesData?.sseUpdatedAt === sseUpdatedAt
        ) {
          return;
        }
        refreshTableOrderHistoriesData(sseUpdatedAt as number);
        break;
      }

      case 'SHOP': {
        //TODO: 테스트 필요
        refreshShopDetailData();
        window.location.reload();
        break;
      }

      case 'MENU':
        {
          refreshCategoriesData();
        }
        break;

      case 'TABLE':
        {
          refreshTableGroupData();
        }
        break;

      case 'DEVICE':
        {
          // api요청
          queryClient.refetchQueries({
            queryKey: queryKeys.device.list(shopCode),
          });
        }
        break;

      case 'PICKUP':
        {
          if (!deviceData?.tableNumber || !sseData?.data) {
            return;
          }

          if (!(deviceData.tableNumber in sseData.data)) {
            return;
          }

          const message = sseData.data[deviceData.tableNumber] as string;
          setPickupAlarm({
            showPickupAlarm: true,
            pickupAlertMessage: message,
          });
        }
        break;
      default:
        break;
    }
  }, [
    sseData,
    deviceData,
    shopData,
    tableOrderHistoriesData,
    refreshTableOrderHistoriesData,
    refreshCategoriesData,
    refreshShopDetailData,
    refreshTableGroupData,
    setPickupAlarm,
    queryClient,
  ]);
};
