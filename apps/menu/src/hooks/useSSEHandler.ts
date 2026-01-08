import { useCallback, useEffect, useRef } from 'react';
import { disconnectSse, initializeSseConnection } from '@/utils/sseConnection';
import { useSSE } from '@repo/feature/hooks';
import { SSE_KEYS } from '@/constants/keys';
import type { ISseMessage, ITableGroup, ITableInfo } from '@repo/api/types';
import { useTableOrderHistoriesData } from '@/hooks/useTableOrderHistoriesData';
import { useDeviceData } from '@/hooks/useDeviceData';
import { useShopData } from '@/hooks/useShopData';
import { useCategoriesData } from '@/hooks/useCategoriesData';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { useTableGroupData } from '@/hooks/useTableGroupData';
import { useQueryClient } from '@repo/api/tanstack-query';
import { queryKeys, usePostDeviceDetail } from '@repo/api/queries';
import { usePickupAlarmStore } from '@/stores/usePickupAlarmStore';
import { CapacitorApp, SystemControl, AndroidInfo } from '@repo/util/app';
import { useModalStore } from '@/stores/useModalStore';
import { toast } from '@repo/feature/utils';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { useInitialPageStore } from '@/stores/useInitialPageStore';
import { useCartStore } from '@/stores/useCartStore';
import { useCustomerCountStore } from '@/stores/useCustomerCountStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useTableGroupStore } from '@/stores/useTableGroupStore';
import { useShopThemePage } from './useShopThemePage';

/**
 * SSE 연결 및 메시지 처리를 담당하는 훅
 */
export const useSSEHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { t } = useCustomerTranslation();

  const { mutateAsync: postDeviceDetail } = usePostDeviceDetail();
  const { data: deviceStoreData, setDataAsync } = useDeviceData({
    skipInitialRequest: true,
  });
  const { shopData: currentShopData } = useShopData({
    skipInitialRequest: true,
  });

  // 최신 deviceStoreData 값을 참조하기 위한 ref
  const deviceStoreDataRef = useRef(deviceStoreData);

  useEffect(() => {
    deviceStoreDataRef.current = deviceStoreData;
  }, [deviceStoreData]);

  // 초기 디바이스 데이터 설정 및 SSE 연결
  useEffect(() => {
    if (!currentShopData?.shopCode) {
      return;
    }

    const getDeviceData = async () => {
      const ipAddress = await AndroidInfo.getIp();
      const androidId = await AndroidInfo.getId();
      const appInfo = await CapacitorApp.getInfo();

      const currentDeviceStoreData = deviceStoreDataRef.current;

      const baseDeviceDetail = {
        ...(currentDeviceStoreData ?? {}),
        ipAddress: ipAddress ?? '',
        androidId: androidId ?? '',
        version: appInfo.version,
        buildNumber: appInfo.build,
      };

      await setDataAsync(baseDeviceDetail);
      await postDeviceDetail({
        shopCode: currentShopData.shopCode,
        ...baseDeviceDetail,
        deviceType: baseDeviceDetail.deviceType ?? 'MENU',
        orderPosNumber: baseDeviceDetail.orderPosNumber ?? null,
        tableNumber: baseDeviceDetail.tableNumber ?? null,
        battery: baseDeviceDetail.battery ?? 0,
        wifiSignal: baseDeviceDetail.wifiSignal ?? '',
      });

      initializeSseConnection();
    };

    getDeviceData();

    return () => {
      disconnectSse();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentShopData?.shopCode]); // shopCode가 있을 때만 실행

  // SSE 데이터 구독
  const { data: sseMessage } = useSSE.useSSEData<ISseMessage>(
    SSE_KEYS.MAIN_CONNECTION
  );

  // 필요한 데이터 훅들
  const { data: currentDeviceData } = useDeviceData({
    skipInitialRequest: true,
  });
  const { data: shopDetailData, refresh: refreshShopDetailData } =
    useShopDetailData({
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
  const { refresh: refreshTableGroupData, data: tableGroupData } =
    useTableGroupData({
      skipInitialRequest: true,
    });
  const { refresh: refreshShopThemePageData } = useShopThemePage({
    skipInitialRequest: true,
  });

  const { clearData: clearInitialPage } = useInitialPageStore();
  const { clearCart } = useCartStore();
  const { clearData: clearCustomerCountData } = useCustomerCountStore();
  const { data: pickupAlarmData, setData: setPickupAlarm } =
    usePickupAlarmStore();

  // 모든 동적 데이터를 ref로 관리하여 dependency 변경 방지
  const dataRefs = useRef({
    currentDeviceData: null as typeof currentDeviceData,
    currentShopData: null as typeof currentShopData,
    shopDetailData: null as typeof shopDetailData,
    tableOrderHistoriesData: null as typeof tableOrderHistoriesData,
    tableGroupData: null as typeof tableGroupData,
    pickupAlarmData: null as typeof pickupAlarmData | null,
    locationPathname: location.pathname,
  });

  // ref 업데이트 (렌더링을 트리거하지 않음)
  useEffect(() => {
    dataRefs.current.currentDeviceData = currentDeviceData;
    dataRefs.current.currentShopData = currentShopData;
    dataRefs.current.shopDetailData = shopDetailData;
    dataRefs.current.tableOrderHistoriesData = tableOrderHistoriesData;
    dataRefs.current.tableGroupData = tableGroupData;
    dataRefs.current.pickupAlarmData = pickupAlarmData;
    dataRefs.current.locationPathname = location.pathname;
  }, [
    currentDeviceData,
    currentShopData,
    shopDetailData,
    tableOrderHistoriesData,
    tableGroupData,
    pickupAlarmData,
    location.pathname,
  ]);

  // 픽업 알림 상태를 ref로 관리
  const pickupAlarmStateRef = useRef(pickupAlarmData.showPickupAlarm);

  useEffect(() => {
    pickupAlarmStateRef.current = pickupAlarmData.showPickupAlarm;
  }, [pickupAlarmData.showPickupAlarm]);

  // refetch 함수들
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

  // 모든 handler 함수들을 ref로 관리하여 dependency 변경 방지
  const handlersRef = useRef({
    handleOrderMessage: (shopCode: string, message: ISseMessage) => {
      handlersRef.current.refetchCurrentTableList(shopCode);

      const { currentDeviceData, tableOrderHistoriesData } = dataRefs.current;

      if (!message.data || !currentDeviceData?.tableNumber) {
        return;
      }

      const currentTableNumber = currentDeviceData.tableNumber;
      const orderDataByTable = message.data as { [key: string]: number };

      if (!(currentTableNumber in orderDataByTable)) {
        const hasExistingOrders =
          tableOrderHistoriesData &&
          tableOrderHistoriesData !== 'isEmptyTable' &&
          tableOrderHistoriesData?.orderDetailMenuList?.length > 0;

        if (hasExistingOrders) {
          refreshTableOrderHistoriesData();
          clearInitialPage();
          clearCart();
          clearCustomerCountData();
        }
        return;
      }

      const sseUpdatedAt = orderDataByTable[currentTableNumber];
      const isOrderUnchanged =
        tableOrderHistoriesData &&
        tableOrderHistoriesData !== 'isEmptyTable' &&
        tableOrderHistoriesData?.sseUpdatedAt === sseUpdatedAt;

      if (isOrderUnchanged) {
        return;
      }

      refreshTableOrderHistoriesData(sseUpdatedAt);
    },

    handleShopMessage: async () => {
      const { locationPathname } = dataRefs.current;

      if (locationPathname === ROUTES.LOGIN.path) {
        return;
      }

      await refreshShopDetailData();
      window.location.reload();
    },

    handleMenuMessage: () => {
      refreshCategoriesData();
      useModalStore.getState().closeMenuDetail();
      toast(t('메뉴정보가 업데이트 되었습니다.'), {
        position: 'center-center',
        duration: 1500,
      });
    },

    handleTableMessage: async (shopCode: string) => {
      await refreshTableGroupData();
      handlersRef.current.refetchCurrentTableList(shopCode);
      handlersRef.current.refetchDeviceList(shopCode);

      const { currentDeviceData, tableGroupData, locationPathname } =
        dataRefs.current;

      if (!currentDeviceData?.tableNumber) {
        return;
      }

      const currentTableNumber = currentDeviceData.tableNumber;

      setTimeout(() => {
        const updatedTableGroupData =
          useTableGroupStore.getState()?.data || tableGroupData;

        if (
          !!updatedTableGroupData &&
          !updatedTableGroupData
            .map((tableGroup: ITableGroup) => tableGroup.tableList)
            .flat()
            .some(
              (table: ITableInfo | undefined) =>
                table?.tableNumber === currentTableNumber
            )
        ) {
          if (locationPathname === ROUTES.ROOT.path) {
            navigate(ROUTES.TABLES.generate(), { replace: true });
          }
        }
      }, 100);
    },

    handleDeviceMessage: (shopCode: string) => {
      handlersRef.current.refetchDeviceList(shopCode);
    },

    handlePickupMessage: (message: ISseMessage) => {
      const { shopDetailData, currentDeviceData } = dataRefs.current;
      const usePickupAlert =
        shopDetailData?.shopSetting?.usePickupAlert ?? false;

      if (!usePickupAlert) {
        return;
      }

      if (!currentDeviceData?.tableNumber || !message?.data) {
        return;
      }

      if (pickupAlarmStateRef.current) {
        return;
      }

      const currentTableNumber = currentDeviceData.tableNumber;
      const pickupDataByTable = message.data as { [key: string]: string };

      if (!(currentTableNumber in pickupDataByTable)) {
        return;
      }

      const pickupAlertMessage = pickupDataByTable[currentTableNumber] ?? '';

      setPickupAlarm({
        showPickupAlarm: true,
        pickupAlertMessage,
      });
      SystemControl.playSound({ type: 'dingdong' });
    },

    handleDeviceControlMessage: (
      controlAction: () => void,
      message: ISseMessage
    ) => {
      const { currentDeviceData } = dataRefs.current;

      if (!message.data || !currentDeviceData?.androidId) {
        return;
      }

      const targetDeviceIds = message.data as string[];
      const currentAndroidId = currentDeviceData.androidId;

      if (targetDeviceIds.includes(currentAndroidId)) {
        controlAction();
      }
    },

    handleShopThemeMessage: () => {
      refreshShopThemePageData();
    },

    // refetch 함수들
    refetchCurrentTableList,
    refetchDeviceList,
  });

  // handler ref 업데이트 (필요한 함수들만)
  useEffect(() => {
    handlersRef.current.refetchCurrentTableList = refetchCurrentTableList;
    handlersRef.current.refetchDeviceList = refetchDeviceList;
  }, [refetchCurrentTableList, refetchDeviceList]);

  // SSE 메시지 처리 (sseMessage만 dependency에 포함)
  useEffect(() => {
    // sseMessage가 없으면 처리하지 않음
    if (!sseMessage) {
      return;
    }

    const { currentShopData, currentDeviceData } = dataRefs.current;

    // 필수 데이터 검증
    if (!currentDeviceData || !currentShopData || !currentShopData.shopCode) {
      return;
    }

    // shopCode 일치 확인
    if (sseMessage.shopCode !== currentShopData.shopCode) {
      return;
    }

    const shopCode = currentShopData.shopCode;

    // 메시지 타입에 따라 처리
    switch (sseMessage.type) {
      case 'ORDER':
        handlersRef.current.handleOrderMessage(shopCode, sseMessage);
        break;

      case 'SHOP':
        handlersRef.current.handleShopMessage();
        break;

      case 'MENU':
        handlersRef.current.handleMenuMessage();
        break;

      case 'TABLE':
        handlersRef.current.handleTableMessage(shopCode);
        break;

      case 'DEVICE':
        handlersRef.current.handleDeviceMessage(shopCode);
        break;

      case 'PICKUP':
        handlersRef.current.handlePickupMessage(sseMessage);
        break;

      case 'DEVICE_OFF':
        handlersRef.current.handleDeviceControlMessage(() => {
          SystemControl.exitApp();
        }, sseMessage);
        break;

      case 'DEVICE_RESTART':
        handlersRef.current.handleDeviceControlMessage(() => {
          SystemControl.reboot();
        }, sseMessage);
        break;

      case 'DEVICE_APP_UPDATE':
        handlersRef.current.handleDeviceControlMessage(() => {
          // TODO: 앱 업데이트 브릿지 호출 필요
        }, sseMessage);
        break;

      case 'DEVICE_SCREEN_OFF':
        handlersRef.current.handleDeviceControlMessage(() => {
          SystemControl.lockScreen();
        }, sseMessage);
        break;

      case 'DEVICE_SCREEN_ON':
        handlersRef.current.handleDeviceControlMessage(() => {
          SystemControl.wakeScreen();
        }, sseMessage);
        break;

      case 'SHOP_THEME_PAGE':
      case 'SHOP_THEME_MENU':
        handlersRef.current.handleShopThemeMessage();
        break;

      default:
        break;
    }
  }, [sseMessage]); // sseMessage만 dependency에 포함
};
