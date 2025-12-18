import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { disconnectSse, initializeSseConnection } from '@/utils/sseConnection';
import { useSSE } from '@repo/feature/hooks';
import { SSE_KEYS } from '@/constants/keys';
import type { ISseMessage } from '@repo/api/types';
import { useTableOrderHistoriesData } from '@/hooks/useTableOrderHistoriesData';
import { useDeviceData } from '@/hooks/useDeviceData';
import { useShopData } from '@/hooks/useShopData';
import { useModalStore } from '@/stores/useModalStore';
import { useCategoriesData } from '@/hooks/useCategoriesData';

const App = () => {
  useEffect(() => {
    initializeSseConnection();

    return () => {
      disconnectSse();
    };
  }, []);

  const { setModalData } = useModalStore();
  const { data: sseData } = useSSE.useSSEData<ISseMessage>(
    SSE_KEYS.MAIN_CONNECTION
  );
  const { data: deviceData } = useDeviceData({ skipInitialRequest: true });
  const { shopData } = useShopData({ skipInitialRequest: true });
  const {
    data: tableOrderHistoriesData,
    refresh: refreshTableOrderHistoriesData,
  } = useTableOrderHistoriesData({
    skipInitialRequest: true,
  });
  const {
    refresh: refreshCategoriesData,
    sseUpdatedAt: categoriesSseUpdatedAt,
  } = useCategoriesData({
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

    if (!(deviceData.tableNumber in sseData.data)) {
      return;
    }

    const sseUpdatedAt = sseData.data[deviceData.tableNumber];

    switch (sseData.type) {
      case 'ORDER':
        (() => {
          if (
            !tableOrderHistoriesData?.sseUpdatedAt ||
            tableOrderHistoriesData?.sseUpdatedAt !== sseUpdatedAt
          ) {
            refreshTableOrderHistoriesData(sseUpdatedAt);
          }
        })();
        break;
      case 'SHOP':
        (() => {
          if (
            !categoriesSseUpdatedAt ||
            categoriesSseUpdatedAt !== sseUpdatedAt
          ) {
            //TODO: 테스트 필요
            refreshCategoriesData(sseUpdatedAt);
            window.location.reload();
          }
        })();
        break;
      case 'MENU':
        break;
      case 'TABLE':
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
    categoriesSseUpdatedAt,
  ]);

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default App;
