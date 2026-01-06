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
import { queryKeys } from '@repo/api/queries';
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

  const { data: deviceStoreData, setDataAsync } = useDeviceData({
    skipInitialRequest: true,
  });

  // 최신 deviceStoreData 값을 참조하기 위한 ref
  const deviceStoreDataRef = useRef(deviceStoreData);

  useEffect(() => {
    deviceStoreDataRef.current = deviceStoreData;
  }, [deviceStoreData]);

  // 초기 디바이스 데이터 설정
  // sse 연결
  useEffect(() => {
    const getDeviceData = async () => {
      const ipAddress = await AndroidInfo.getIp();
      const androidId = await AndroidInfo.getId();
      const appInfo = await CapacitorApp.getInfo();

      // 최신 deviceStoreData 값을 참조
      const currentDeviceStoreData = deviceStoreDataRef.current;

      await setDataAsync({
        ...(currentDeviceStoreData ?? {}),
        ipAddress: ipAddress ?? '',
        androidId: androidId ?? '',
        version: appInfo.version,
        buildNumber: appInfo.build,
      });

      // 로그인이 되어있을경우 연결 시도
      initializeSseConnection();
    };

    getDeviceData();

    return () => {
      disconnectSse();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // SSE 데이터 구독
  const { data: sseMessage } = useSSE.useSSEData<ISseMessage>(
    SSE_KEYS.MAIN_CONNECTION
  );

  const { clearData: clearInitialPage } = useInitialPageStore();
  const { clearCart } = useCartStore();
  const { clearData: clearCustomerCountData } = useCustomerCountStore();

  // 필요한 데이터 훅들
  const { data: currentDeviceData } = useDeviceData({
    skipInitialRequest: true,
  });
  const { shopData: currentShopData } = useShopData({
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

  const { data: pickupAlarmData, setData: setPickupAlarm } =
    usePickupAlarmStore();

  // 픽업 알림 상태를 ref로 관리 (dependency 변경 방지)
  const pickupAlarmStateRef = useRef(pickupAlarmData.showPickupAlarm);

  // pickupAlarmData 변경 시 ref 업데이트
  useEffect(() => {
    pickupAlarmStateRef.current = pickupAlarmData.showPickupAlarm;
  }, [pickupAlarmData.showPickupAlarm]);

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
          // 주문내역 api refresh
          refreshTableOrderHistoriesData();
          // 초기화면 노출
          clearInitialPage();
          // 장바구니 비우기
          clearCart();
          // 객수 선택 초기화
          clearCustomerCountData();
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
      clearInitialPage,
      clearCart,
      clearCustomerCountData,
    ]
  );

  // 매장 정보 변경 메시지 처리
  const handleShopMessage = useCallback(async () => {
    // root 페이지에 있을 경우에만 실행
    if (location.pathname !== ROUTES.ROOT.path) {
      return;
    }

    await refreshShopDetailData();
    window.location.reload();
  }, [refreshShopDetailData, location.pathname]);

  // 메뉴 변경 메시지 처리
  const handleMenuMessage = useCallback(() => {
    refreshCategoriesData();
    useModalStore.getState().closeMenuDetail();
    toast(t('메뉴정보가 업데이트 되었습니다.'), {
      position: 'center-center',
      duration: 1500,
    });
  }, [refreshCategoriesData, t]);

  // 테이블 변경 메시지 처리
  const handleTableMessage = useCallback(
    async (shopCode: string) => {
      // 테이블 그룹 데이터 새로고침
      await refreshTableGroupData();
      refetchCurrentTableList(shopCode);
      refetchDeviceList(shopCode);

      // 현재 테이블이 삭제되었는지 확인
      if (!currentDeviceData?.tableNumber) {
        return;
      }

      const currentTableNumber = currentDeviceData.tableNumber;

      // 테이블 그룹 데이터가 로드된 후에만 확인
      // refreshTableGroupData가 완료되면 tableGroupData가 업데이트되므로
      // 약간의 지연을 두고 확인
      setTimeout(() => {
        const updatedTableGroupData =
          useTableGroupStore.getState()?.data || tableGroupData;

        // 테이블이 삭제되었는지 확인
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
          // 현재 페이지가 ROOT인 경우 TABLES 페이지로 리다이렉트
          if (location.pathname === ROUTES.ROOT.path) {
            navigate(ROUTES.TABLES.generate(), { replace: true });
          }
        }
      }, 100);
    },
    [
      refreshTableGroupData,
      refetchCurrentTableList,
      refetchDeviceList,
      currentDeviceData?.tableNumber,
      tableGroupData,
      location.pathname,
      navigate,
    ]
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
    const usePickupAlert = shopDetailData?.shopSetting?.usePickupAlert ?? false;

    // 픽업 알림이 비활성화되어 있으면 실행하지 않음
    if (!usePickupAlert) {
      return;
    }

    if (!currentDeviceData?.tableNumber || !sseMessage?.data) {
      return;
    }

    // 이미 팝업이 표시 중이면 중복 실행 방지 (ref 사용으로 dependency 변경 없음)
    if (pickupAlarmStateRef.current) {
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
    SystemControl.playSound({ type: 'dingdong' });
  }, [
    shopDetailData?.shopSetting?.usePickupAlert,
    currentDeviceData?.tableNumber,
    sseMessage?.data,
    setPickupAlarm,
  ]);

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

  // 상점 테마 페이지 메시지 처리
  const handleShopThemeMessage = useCallback(() => {
    refreshShopThemePageData();
  }, [refreshShopThemePageData]);

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

      case 'SHOP_THEME_PAGE':
        handleShopThemeMessage();
        break;

      case 'SHOP_THEME_MENU':
        handleShopThemeMessage();
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
    handleShopThemeMessage,
  ]);
};
