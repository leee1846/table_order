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
import { useDeviceListData } from '@/hooks/useDeviceListData';

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
  const { refresh: refreshDeviceListData } = useDeviceListData({
    skipInitialRequest: true,
  });

  // SSE 메시지 처리
  useEffect(() => {
    if (
      !sseData ||
      !deviceData ||
      !deviceData?.tableNumber ||
      !shopData ||
      !shopData?.shopCode
    ) {
      return;
    }

    if (sseData.shopCode !== shopData?.shopCode) {
      return;
    }

    switch (sseData.type) {
      case 'ORDER': {
        if (!sseData.data) {
          return;
        }
        if (!(deviceData.tableNumber in sseData.data)) {
          return;
        }

        const sseUpdatedAt = sseData.data[deviceData.tableNumber];

        if (
          !tableOrderHistoriesData?.sseUpdatedAt ||
          tableOrderHistoriesData?.sseUpdatedAt !== sseUpdatedAt
        ) {
          refreshTableOrderHistoriesData(sseUpdatedAt);
        }
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
          // TODO: 테스트 필요
          refreshDeviceListData();
        }
        break;
      case 'PICKUP':
        break;
      default:
        break;
    }
  }, [
    sseData,
    deviceData,
    shopData,
    tableOrderHistoriesData?.sseUpdatedAt,
    refreshTableOrderHistoriesData,
    refreshCategoriesData,
    refreshShopDetailData,
    refreshTableGroupData,
    refreshDeviceListData,
  ]);
};
