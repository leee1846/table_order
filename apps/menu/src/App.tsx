import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { disconnectSse, initializeSseConnection } from '@/utils/sseConnection';
import { useSSE } from '@repo/feature/hooks';
import { SSE_KEYS } from '@/constants/keys';
import type { ISseMessage } from '@repo/api/types';
import { useTableOrderHistoriesData } from '@/hooks/useTableOrderHistoriesData';
import { useDeviceData } from '@/hooks/useDeviceData';
import { useShopData } from '@/hooks/useShopData';
import { useCategoriesData } from '@/hooks/useCategoriesData';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { useTableGroupData } from './hooks/useTableGroupData';

const App = () => {
  useEffect(() => {
    initializeSseConnection();

    return () => {
      disconnectSse();
    };
  }, []);

  const { data: sseData } = useSSE.useSSEData<ISseMessage>(
    SSE_KEYS.MAIN_CONNECTION
  );
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
  ]);

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default App;
