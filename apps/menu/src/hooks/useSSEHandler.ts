import { useCallback, useEffect } from 'react';
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
  const queryClient = useQueryClient();

  // SSE 연결 초기화/해제
  useEffect(() => {
    initializeSseConnection();

    return () => {
      disconnectSse();
    };
  }, []);

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

  const refetchCurrentTableList = useCallback(
    (shopCode: string) => {
      queryClient.refetchQueries({
        queryKey: queryKeys.orders.currentTableList(shopCode),
      });
    },
    [queryClient]
  );
  const refetchDeviceList = useCallback(
    (shopCode: string) => {
      queryClient.refetchQueries({
        queryKey: queryKeys.device.list(shopCode),
      });
    },
    [queryClient]
  );

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

        // 주문이 관리자앱에 의해 모두 삭제 되었을경우
        if (!(deviceData.tableNumber in sseData.data)) {
          if (
            tableOrderHistoriesData &&
            tableOrderHistoriesData !== 'isEmptyTable' &&
            tableOrderHistoriesData?.orderDetailMenuList?.length > 0
          ) {
            refreshTableOrderHistoriesData();
            break;
          }
          return;
        }

        const sseUpdatedAt = sseData.data[deviceData.tableNumber];

        // 주문이 변경되었을경우
        if (
          tableOrderHistoriesData &&
          tableOrderHistoriesData !== 'isEmptyTable' &&
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
          refetchCurrentTableList(shopCode);
          refetchDeviceList(shopCode);
        }
        break;

      case 'DEVICE':
        {
          // api요청
          refetchDeviceList(shopCode);
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
    refetchCurrentTableList,
    refetchDeviceList,
  ]);
};
