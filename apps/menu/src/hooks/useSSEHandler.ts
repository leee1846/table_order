import { useCallback, useEffect, useRef } from 'react';
import { disconnectSse, initializeSseConnection } from '@/utils/sseConnection';
import { useSSE } from '@repo/feature/hooks';
import { SSE_KEYS } from '@/constants/keys';
import type {
  IDevice,
  IPostDeviceDetailRequest,
  ISseMessage,
  ITableGroup,
  ITableInfo,
  TDeviceType,
  TControlStatus,
} from '@repo/api/types';
import { useTableOrderHistoriesData } from '@/hooks/useTableOrderHistoriesData';
import { useDeviceData } from '@/hooks/useDeviceData';
import { useShopData } from '@/hooks/useShopData';
import { useCategoriesData } from '@/hooks/useCategoriesData';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { useTableGroupData } from '@/hooks/useTableGroupData';
import { useQueryClient } from '@repo/api/tanstack-query';
import { queryKeys, usePostDeviceDetail } from '@repo/api/queries';
import { getLatestAppVersion } from '@repo/api/fetchers';
import { usePickupAlarmStore } from '@/stores/usePickupAlarmStore';
import { SystemControl, Installer } from '@repo/util/app';
import { useModalStore } from '@/stores/useModalStore';
import { toast, openConfirmDialog } from '@repo/feature/utils';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { useInitialPageStore } from '@/stores/useInitialPageStore';
import { useCartStore } from '@/stores/useCartStore';
import { useCustomerCountStore } from '@/stores/useCustomerCountStore';
import { useCustomerLanguageStore } from '@/stores/useCustomerLanguageStore';
import { useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useTableGroupStore } from '@/stores/useTableGroupStore';
import { useRequestAdminAccessModalStore } from '@/stores/useRequestAdminAccessModalStore';
import { useShopThemePage } from './useShopThemePage';
import { useDialogStore } from '@repo/feature/stores';
import { clearAuthData } from '@/utils/auth';
import { getDeviceInfo } from '@/utils/deviceInfo';
import type { TFunction } from 'i18next';

type DeviceDetailPayload = Record<string, unknown> & {
  deviceType?: TDeviceType | null;
  orderPosNumber?: number | null;
  tableNumber?: string | null;
  battery?: number | null;
  wifiSignal?: string | null;
  controlStatus?: TControlStatus;
};

type DeviceStoreRef = {
  current: Record<string, unknown> | null | undefined;
};

type DeviceDataSyncDeps = {
  deviceStoreDataRef: DeviceStoreRef;
  setDataAsync: (data: Partial<IDevice>) => void | Promise<void>;
  refreshDeviceData: () => Promise<IDevice | undefined>;
  postDeviceDetail: (req: IPostDeviceDetailRequest) => Promise<unknown>;
  t: TFunction;
};

/** 디바이스 정보 수집 → 스토어/ref 반영 → 서버 POST */
async function collectDeviceInfoAndSyncToServer(
  syncDeps: DeviceDataSyncDeps,
  shopCode: string,
  controlStatus: TControlStatus = null
): Promise<void> {
  const {
    deviceStoreDataRef,
    setDataAsync,
    refreshDeviceData,
    postDeviceDetail,
    t,
  } = syncDeps;
  const existingStoreSnapshot = deviceStoreDataRef.current ?? {};
  const { ipAddress, androidId, appInfo } = await getDeviceInfo({ t });

  if (androidId && !existingStoreSnapshot.androidId) {
    const storeWithAndroidId = { ...existingStoreSnapshot, androidId };
    deviceStoreDataRef.current = storeWithAndroidId;
    await setDataAsync(storeWithAndroidId as Partial<IDevice>);
  }

  const deviceDetailFromApi = androidId ? await refreshDeviceData() : null;
  const mergedDeviceDetail = {
    ...existingStoreSnapshot,
    ipAddress,
    androidId,
    version: appInfo.version,
    buildNumber: appInfo.build,
    controlStatus,
    ...(deviceDetailFromApi && {
      deviceType: deviceDetailFromApi.deviceType,
      tableNumber:
        deviceDetailFromApi.tableNumber ?? existingStoreSnapshot.tableNumber,
      orderPosNumber: deviceDetailFromApi.orderPosNumber,
      deviceSeq: deviceDetailFromApi.deviceSeq,
      shopSeq: deviceDetailFromApi.shopSeq,
    }),
  } as DeviceDetailPayload;

  deviceStoreDataRef.current = mergedDeviceDetail;
  await setDataAsync(mergedDeviceDetail as Partial<IDevice>);

  const resolvedDeviceType = (mergedDeviceDetail.deviceType ??
    'MENU') as TDeviceType;
  const isOrderPosDevice = resolvedDeviceType === 'ORDER_POS';
  await postDeviceDetail({
    shopCode,
    ...mergedDeviceDetail,
    deviceType: resolvedDeviceType,
    orderPosNumber: isOrderPosDevice
      ? (mergedDeviceDetail.orderPosNumber ?? null)
      : null,
    tableNumber: isOrderPosDevice
      ? null
      : (mergedDeviceDetail.tableNumber ?? null),
    battery: mergedDeviceDetail.battery ?? 0,
    wifiSignal: mergedDeviceDetail.wifiSignal ?? '',
    controlStatus: mergedDeviceDetail.controlStatus ?? null,
  } as IPostDeviceDetailRequest);
}

/**
 * SSE(Server-Sent Events) 연결 및 실시간 메시지 처리를 담당하는 커스텀 훅
 *
 * @description
 * - 디바이스 정보를 초기화하고 서버와 SSE 연결을 설정합니다
 * - 서버로부터 수신된 실시간 메시지를 타입별로 처리합니다 (ORDER, SHOP, MENU, TABLE, DEVICE, PICKUP 등)
 * - useRef를 활용하여 불필요한 리렌더링을 방지합니다
 * - 컴포넌트 언마운트 시 SSE 연결을 자동으로 해제합니다
 *
 * @remarks
 * - 매장 코드가 존재할 때만 SSE 연결을 초기화합니다
 * - 모든 메시지 처리는 현재 매장의 shopCode와 일치하는 경우에만 수행됩니다
 */
export const useSSEHandler = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  // i18n: 고객용 번역 함수
  const { t } = useCustomerTranslation();

  const { mutateAsync: postDeviceDetail } = usePostDeviceDetail();
  const {
    data: deviceStoreData,
    setDataAsync,
    refresh: refreshDeviceData,
  } = useDeviceData({ skipInitialRequest: true });
  const { shopData: currentShopData } = useShopData({
    skipInitialRequest: true,
  });

  // 최신 deviceStoreData 값을 참조하기 위한 ref (비동기 함수에서 최신 값 참조용)
  const deviceStoreDataRef = useRef(deviceStoreData);

  // deviceStoreData 변경 시 ref 동기화 (렌더링 없이 최신 값 유지)
  useEffect(() => {
    deviceStoreDataRef.current = deviceStoreData;
  }, [deviceStoreData]);

  const deviceDataSyncDeps: DeviceDataSyncDeps = {
    deviceStoreDataRef,
    setDataAsync,
    refreshDeviceData,
    postDeviceDetail,
    t,
  };

  // 초기 디바이스 데이터 설정 및 SSE 연결
  useEffect(() => {
    if (!currentShopData?.shopCode) {
      return;
    }

    const run = async () => {
      await collectDeviceInfoAndSyncToServer(
        deviceDataSyncDeps,
        currentShopData.shopCode
      );
      await initializeSseConnection();
    };
    run();

    // cleanup: 컴포넌트 언마운트 또는 shopCode 변경 시 SSE 연결 해제
    return () => {
      disconnectSse();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentShopData?.shopCode]); // shopCode가 있을 때만 실행

  // SSE 데이터 구독: 서버로부터 실시간으로 수신되는 메시지
  const { data: sseMessage } = useSSE.useSSEData<ISseMessage>(
    SSE_KEYS.MAIN_CONNECTION
  );

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
  // 핸들러 함수에서 최신 데이터를 참조하되, useEffect dependency에 포함하지 않기 위함
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
  // 데이터가 변경될 때마다 ref에 최신 값 반영 (비동기 핸들러에서 사용)
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

  // 픽업 알림 상태를 ref로 관리 (중복 알림 방지용)
  const pickupAlarmStateRef = useRef(pickupAlarmData.showPickupAlarm);

  // 픽업 알림 표시 상태 변경 시 ref 동기화
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

  // 모든 handler 함수들을 ref로 관리하여 dependency 변경 방지
  // useEffect dependency에 포함하지 않고도 최신 핸들러 함수를 참조할 수 있도록 함
  const handlersRef = useRef({
    handleOrderMessage: async (shopCode: string, message: ISseMessage) => {
      // 현재 테이블 목록 먼저 새로고침
      handlersRef.current.refetchCurrentTableList(shopCode);
      const { currentDeviceData, tableOrderHistoriesData } = dataRefs.current;
      if (!message.data || !currentDeviceData?.tableNumber) {
        return;
      }

      const currentTableNumber = currentDeviceData.tableNumber;
      // 메시지 데이터: { [tableNumber]: sseUpdatedAt } 형태
      const orderDataByTable = message.data as { [key: string]: number };

      // 현재 테이블이 주문 목록에 없거나, 주문 그룹만 생성되어 있고, 주문이 없을 경우
      if (!(currentTableNumber in orderDataByTable)) {
        const hasExistingOrders =
          tableOrderHistoriesData &&
          tableOrderHistoriesData !== 'isEmptyTable' &&
          (tableOrderHistoriesData?.orderDetailMenuList?.length > 0 ||
            tableOrderHistoriesData?.orderDetailMenuList?.length < 1);

        // 기존 주문이 있었다면 모든 상태 초기화
        if (hasExistingOrders) {
          refreshTableOrderHistoriesData(); // 주문 내역 새로고침
          clearInitialPage(); // 초기 페이지 데이터 초기화
          clearCart(); // 장바구니 초기화
          clearCustomerCountData(); // 고객 수 초기화
          useCustomerLanguageStore.getState().clearData(); // 언어 설정 초기화
          useModalStore.getState().closeAllModals(); // 모든 모달 닫기
          useDialogStore.getState().closeAllDialogs(); // 모든 다이얼로그 닫기
          return;
        }

        return;
      }

      // 현재 테이블의 주문 업데이트 시간
      const sseUpdatedAt = orderDataByTable[currentTableNumber];
      // 주문이 변경되지 않았으면 (중복 처리 방지)
      const isOrderUnchanged =
        tableOrderHistoriesData &&
        tableOrderHistoriesData !== 'isEmptyTable' &&
        tableOrderHistoriesData?.sseUpdatedAt === sseUpdatedAt;

      if (isOrderUnchanged) {
        return;
      }

      // 주문 내역 새로고침 (sseUpdatedAt 전달하여 서버에서 해당 시점 이후 데이터만 조회)
      const refreshResult = await refreshTableOrderHistoriesData(sseUpdatedAt);

      if (!refreshResult) {
        return;
      }

      const {
        isCashPaymentInducementModalOpened,
        isSplitPaymentModalOpened,
        isCardPaymentInstallmentModalOpened,
      } = useModalStore.getState().data;

      const isPaymentModalOpened =
        isCashPaymentInducementModalOpened ||
        isSplitPaymentModalOpened ||
        isCardPaymentInstallmentModalOpened;

      if (!isPaymentModalOpened) {
        return;
      }

      const totalAmount = refreshResult.totalAmount ?? 0;
      const paidAmount = refreshResult.paymentList
        .filter((payment) => !payment.isCanceled)
        .reduce((sum, payment) => sum + payment.transactionAmount, 0);
      const isFullyPaid = totalAmount - paidAmount === 0;

      if (isFullyPaid) {
        useModalStore.getState().closeAllModals();
      }
    },

    // SHOP 메시지 핸들러: 매장 정보 업데이트 처리
    handleShopMessage: async () => {
      const { locationPathname } = dataRefs.current;

      // 로그인 페이지에서는 처리하지 않음
      if (locationPathname === ROUTES.LOGIN.path) {
        return;
      }

      // 매장 상세 정보 새로고침 후 전체 페이지 리로드
      await refreshShopDetailData();
      await SystemControl.deepCleanAndReload();
    },

    // MENU 메시지 핸들러: 메뉴 정보 업데이트 처리
    handleMenuMessage: () => {
      refreshCategoriesData(); // 카테고리 데이터 새로고침
      useModalStore.getState().closeMenuDetail(); // 메뉴 상세 모달 닫기
      // 업데이트 알림 토스트 표시
      toast(t('메뉴정보가 업데이트 되었습니다.'), {
        position: 'center-center',
        duration: 1500,
      });
    },

    // TABLE 메시지 핸들러: 테이블 정보 업데이트 처리
    handleTableMessage: async (shopCode: string) => {
      await refreshTableGroupData(); // 테이블 그룹 데이터 새로고침
      handlersRef.current.refetchCurrentTableList(shopCode); // 현재 테이블 목록 새로고침
      handlersRef.current.refetchDeviceList(shopCode); // 디바이스 목록 새로고침

      const { currentDeviceData, tableGroupData } = dataRefs.current;

      if (!currentDeviceData?.tableNumber) {
        return;
      }

      const currentTableNumber = currentDeviceData.tableNumber;

      // 데이터 업데이트 후 테이블 존재 여부 확인을 위해 약간의 지연
      setTimeout(() => {
        const updatedTableGroupData =
          useTableGroupStore.getState()?.data || tableGroupData;

        // 현재 테이블이 테이블 목록에 존재하지 않으면 (테이블 삭제됨)
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
          toast(t('존재하지 않는 테이블입니다.'), {
            position: 'center-center',
            duration: 1500,
          });
          setDataAsync({
            ...currentDeviceData,
            tableNumber: null,
          });
          useRequestAdminAccessModalStore.getState().setShow(true);
        }
      }, 100);
    },

    // DEVICE 메시지 핸들러: 디바이스 정보 업데이트 처리
    handleDeviceMessage: (shopCode: string) => {
      handlersRef.current.refetchDeviceList(shopCode); // 디바이스 목록 새로고침
    },

    // PICKUP 메시지 핸들러: 픽업 알림 처리
    handlePickupMessage: (message: ISseMessage) => {
      const { shopDetailData, currentDeviceData } = dataRefs.current;
      // 매장 설정에서 픽업 알림 사용 여부 확인
      const usePickupAlert =
        shopDetailData?.shopSetting?.usePickupAlert ?? false;

      if (!usePickupAlert) {
        return;
      }

      if (!currentDeviceData?.tableNumber || !message?.data) {
        return;
      }

      // 이미 알림이 표시 중이면 중복 표시 방지
      if (pickupAlarmStateRef.current) {
        return;
      }

      const currentTableNumber = currentDeviceData.tableNumber;
      // 메시지 데이터: { [tableNumber]: alertMessage } 형태
      const pickupDataByTable = message.data as { [key: string]: string };

      // 현재 테이블에 대한 픽업 알림이 없으면 처리하지 않음
      if (!(currentTableNumber in pickupDataByTable)) {
        return;
      }

      const pickupAlertMessage = pickupDataByTable[currentTableNumber] ?? '';

      // 픽업 알림 상태 설정
      setPickupAlarm({
        showPickupAlarm: true,
        pickupAlertMessage,
      });
      // 알림 사운드 재생
      SystemControl.playSound({ type: 'dingdong' });
    },

    // 디바이스 제어 메시지 핸들러: 공통 로직 (DEVICE_OFF, DEVICE_RESTART 등)
    handleDeviceControlMessage: (
      controlAction: () => void,
      message: ISseMessage
    ) => {
      const { currentDeviceData } = dataRefs.current;

      if (!message.data || !currentDeviceData?.androidId) {
        return;
      }

      // 메시지 데이터: 대상 디바이스 ID 배열
      const targetDeviceIds = message.data as string[];
      const currentAndroidId = currentDeviceData.androidId;

      // 현재 기기가 대상 목록에 포함되어 있으면 제어 액션 실행
      if (targetDeviceIds.includes(currentAndroidId)) {
        controlAction();
      }
    },

    // SHOP_THEME_PAGE/MENU 메시지 핸들러: 매장 테마 정보 업데이트 처리
    handleShopThemeMessage: () => {
      refreshShopThemePageData(); // 매장 테마 페이지 데이터 새로고침
    },

    // LOGOUT 메시지 핸들러: 로그아웃 처리
    handleLogoutMessage: () => {
      openConfirmDialog({
        title: t('로그아웃'),
        content: t('비밀번호가 변경되었습니다. 다시 로그인 해주세요.'),
        primaryText: t('확인'),
        onConfirm: async () => {
          await clearAuthData();
          window.location.replace(ROUTES.LOGIN.generate());
        },
      });
    },

    // refetch 함수들 (ref에 저장하여 핸들러에서 사용)
    refetchCurrentTableList,
    refetchDeviceList,
  });

  // handler ref 업데이트 (필요한 함수들만)
  // useCallback으로 생성된 refetch 함수들이 변경될 때 ref에 반영
  useEffect(() => {
    handlersRef.current.refetchCurrentTableList = refetchCurrentTableList;
    handlersRef.current.refetchDeviceList = refetchDeviceList;
  }, [refetchCurrentTableList, refetchDeviceList]);

  // SSE 메시지 처리 (sseMessage만 dependency에 포함)
  // 서버로부터 수신된 메시지에 따라 적절한 핸들러 함수 호출
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

    // 메시지 타입에 따라 적절한 핸들러 함수 호출
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

      case 'APP_OFF':
        // 앱 종료 제어
        handlersRef.current.handleDeviceControlMessage(() => {
          SystemControl.shutdown();
        }, sseMessage);
        break;

      case 'DEVICE_RESTART':
        // 기기 재시작 제어
        handlersRef.current.handleDeviceControlMessage(() => {
          SystemControl.reboot();
        }, sseMessage);
        break;

      case 'DEVICE_APP_UPDATE':
        // 앱 업데이트 제어
        (async () => {
          const { currentDeviceData, currentShopData } = dataRefs.current;

          if (!sseMessage.data || !currentDeviceData?.androidId) {
            return;
          }

          // 메시지 데이터: 대상 디바이스 ID 배열
          const targetDeviceIds = sseMessage.data as string[];
          const currentAndroidId = currentDeviceData.androidId;

          // 현재 기기가 대상 목록에 포함되어 있으면 업데이트 실행
          if (!targetDeviceIds.includes(currentAndroidId)) {
            return;
          }

          const response = await getLatestAppVersion('MENU');
          const { downloadPath, checksum } = response.data || {};

          if (!downloadPath || !checksum) {
            return;
          }

          try {
            await Installer.startUpdate(downloadPath, checksum);
          } catch {
            if (currentShopData?.shopCode) {
              await collectDeviceInfoAndSyncToServer(
                deviceDataSyncDeps,
                currentShopData.shopCode,
                'FAIL'
              );
            }
          }
        })();
        break;

      case 'DEVICE_SCREEN_OFF':
        // 화면 잠금 제어
        handlersRef.current.handleDeviceControlMessage(() => {
          SystemControl.lockScreen();
        }, sseMessage);
        break;

      case 'DEVICE_SCREEN_ON':
        // 화면 깨우기 제어
        handlersRef.current.handleDeviceControlMessage(() => {
          SystemControl.wakeScreen();
        }, sseMessage);
        break;

      case 'SHOP_THEME_PAGE':
      case 'SHOP_THEME_MENU':
        handlersRef.current.handleShopThemeMessage();
        break;

      case 'LOGOUT':
        handlersRef.current.handleLogoutMessage();
        break;

      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- postDeviceDetail 등은 ref로 참조하므로 의존성에서 제외
  }, [sseMessage]);
};
