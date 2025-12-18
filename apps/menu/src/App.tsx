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
  const {
    data: tableOrderHistoriesData,
    refresh: refreshTableOrderHistoriesData,
  } = useTableOrderHistoriesData({
    skipInitialRequest: true,
  });
  const { setModalData } = useModalStore();

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
            setModalData('isOrderHistoryModalOpened', false);
            setModalData('isPaymentsModalOpened', false);
            setModalData('isSplitPaymentModalOpened', false);
            refreshTableOrderHistoriesData(sseUpdatedAt);
          }
        })();
        break;
      case 'SHOP':
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
    setModalData,
  ]);

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default App;
