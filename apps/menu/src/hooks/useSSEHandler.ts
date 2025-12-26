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
import { SystemControl } from '@repo/util/app';

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
  const { data: sseMessage } = useSSE.useSSEData<ISseMessage>(
    SSE_KEYS.MAIN_CONNECTION
  );

  // 필요한 데이터 훅들
  const { data: currentDeviceData } = useDeviceData({
    skipInitialRequest: true,
  });
  const { shopData: currentShopData } = useShopData({
    skipInitialRequest: true,
  });
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

  // 주문 메시지 처리
  const handleOrderMessage = useCallback(
    (shopCode: string) => {
      // TODO: 테스트 필요
      queryClient.refetchQueries({
        queryKey: queryKeys.orders.currentTableList(shopCode),
      });

      if (!sseMessage?.data || !currentDeviceData?.tableNumber) {
        return;
      }

      const currentTableNumber = currentDeviceData.tableNumber;
      const orderDataByTable = sseMessage.data as { [key: string]: number };

      // 주문이 관리자앱에 의해 모두 삭제 되었을경우
      if (!(currentTableNumber in orderDataByTable)) {
        const hasExistingOrders =
          tableOrderHistoriesData &&
          tableOrderHistoriesData !== 'isEmptyTable' &&
          tableOrderHistoriesData?.orderDetailMenuList?.length > 0;

        if (hasExistingOrders) {
          refreshTableOrderHistoriesData();
        }
        return;
      }

      const sseUpdatedAt = orderDataByTable[currentTableNumber];
      const isOrderUnchanged =
        tableOrderHistoriesData &&
        tableOrderHistoriesData !== 'isEmptyTable' &&
        tableOrderHistoriesData?.sseUpdatedAt === sseUpdatedAt;

      // 주문이 변경되었을경우
      if (isOrderUnchanged) {
        return;
      }

      refreshTableOrderHistoriesData(sseUpdatedAt);
    },
    [
      queryClient,
      sseMessage?.data,
      currentDeviceData?.tableNumber,
      tableOrderHistoriesData,
      refreshTableOrderHistoriesData,
    ]
  );

  // 매장 정보 변경 메시지 처리
  const handleShopMessage = useCallback(() => {
    //TODO: 테스트 필요
    refreshShopDetailData();
    window.location.reload();
  }, [refreshShopDetailData]);

  // 메뉴 변경 메시지 처리
  const handleMenuMessage = useCallback(() => {
    refreshCategoriesData();
  }, [refreshCategoriesData]);

  // 테이블 변경 메시지 처리
  const handleTableMessage = useCallback(
    (shopCode: string) => {
      refreshTableGroupData();
      refetchCurrentTableList(shopCode);
      refetchDeviceList(shopCode);
    },
    [refreshTableGroupData, refetchCurrentTableList, refetchDeviceList]
  );

  // 디바이스 변경 메시지 처리
  const handleDeviceMessage = useCallback(
    (shopCode: string) => {
      // api요청
      refetchDeviceList(shopCode);
    },
    [refetchDeviceList]
  );

  // 픽업 알림 메시지 처리
  const handlePickupMessage = useCallback(() => {
    if (!currentDeviceData?.tableNumber || !sseMessage?.data) {
      return;
    }

    const currentTableNumber = currentDeviceData.tableNumber;
    const pickupDataByTable = sseMessage.data as { [key: string]: string };

    if (!(currentTableNumber in pickupDataByTable)) {
      return;
    }

    const pickupAlertMessage = pickupDataByTable[currentTableNumber] ?? '';

    setPickupAlarm({
      showPickupAlarm: true,
      pickupAlertMessage,
    });
    // TODO: 띵동!! 브릿지 호출 필요
  }, [currentDeviceData?.tableNumber, sseMessage?.data, setPickupAlarm]);

  // 디바이스 제어 메시지 처리 (공통 로직)
  const handleDeviceControlMessage = useCallback(
    (controlAction: () => void) => {
      if (!sseMessage?.data || !currentDeviceData?.androidId) {
        return;
      }

      const targetDeviceIds = sseMessage.data as string[];
      const currentAndroidId = currentDeviceData.androidId;

      if (targetDeviceIds.includes(currentAndroidId)) {
        controlAction();
      }
    },
    [sseMessage?.data, currentDeviceData?.androidId]
  );

  // 앱 종료 메시지 처리
  const handleDeviceOffMessage = useCallback(() => {
    handleDeviceControlMessage(() => {
      // App 종료
      SystemControl.exitApp();
    });
  }, [handleDeviceControlMessage]);

  // 기기 재부팅 메시지 처리
  const handleDeviceRestartMessage = useCallback(() => {
    handleDeviceControlMessage(() => {
      // 기기 재부팅
      SystemControl.reboot();
    });
  }, [handleDeviceControlMessage]);

  // 앱 업데이트 메시지 처리
  const handleDeviceAppUpdateMessage = useCallback(() => {
    handleDeviceControlMessage(() => {
      // TODO: 앱 업데이트 브릿지 호출 필요
      console.log('업데이트!!!');
    });
  }, [handleDeviceControlMessage]);

  // 화면 끄기 메시지 처리
  const handleDeviceScreenOffMessage = useCallback(() => {
    handleDeviceControlMessage(() => {
      // 기기 화면 끄기
      SystemControl.lockScreen();
    });
  }, [handleDeviceControlMessage]);

  // 화면 켜기 메시지 처리
  const handleDeviceScreenOnMessage = useCallback(() => {
    handleDeviceControlMessage(() => {
      // 기기 화면 켜기
      SystemControl.wakeScreen();
    });
  }, [handleDeviceControlMessage]);

  // SSE 메시지 처리
  useEffect(() => {
    const currentShopCode = currentShopData?.shopCode;

    if (
      !sseMessage ||
      !currentDeviceData ||
      !currentShopData ||
      !currentShopCode
    ) {
      return;
    }

    if (sseMessage.shopCode !== currentShopData?.shopCode) {
      return;
    }

    switch (sseMessage.type) {
      case 'ORDER':
        handleOrderMessage(currentShopCode);
        break;

      case 'SHOP':
        handleShopMessage();
        break;

      case 'MENU':
        handleMenuMessage();
        break;

      case 'TABLE':
        handleTableMessage(currentShopCode);
        break;

      case 'DEVICE':
        handleDeviceMessage(currentShopCode);
        break;

      case 'PICKUP':
        handlePickupMessage();
        break;

      case 'DEVICE_OFF':
        handleDeviceOffMessage();
        break;

      case 'DEVICE_RESTART':
        handleDeviceRestartMessage();
        break;

      case 'DEVICE_APP_UPDATE':
        handleDeviceAppUpdateMessage();
        break;

      case 'DEVICE_SCREEN_OFF':
        handleDeviceScreenOffMessage();
        break;

      case 'DEVICE_SCREEN_ON':
        handleDeviceScreenOnMessage();
        break;

      default:
        break;
    }
  }, [
    sseMessage,
    currentDeviceData,
    currentShopData,
    handleOrderMessage,
    handleShopMessage,
    handleMenuMessage,
    handleTableMessage,
    handleDeviceMessage,
    handlePickupMessage,
    handleDeviceOffMessage,
    handleDeviceRestartMessage,
    handleDeviceAppUpdateMessage,
    handleDeviceScreenOffMessage,
    handleDeviceScreenOnMessage,
  ]);
};
