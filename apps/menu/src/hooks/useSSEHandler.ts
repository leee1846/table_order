import { useCallback, useEffect, useRef } from 'react';
import { useLocation, useParams, matchPath } from 'react-router-dom';
import type { TFunction } from 'i18next';
import type {
  IDevice,
  IPostDeviceDetailRequest,
  ISseMessage,
  ITableGroup,
  ITableInfo,
  TDeviceType,
  TControlStatus,
} from '@repo/api/types';
import { useQueryClient } from '@repo/api/tanstack-query';
import { queryKeys, usePostDeviceDetail } from '@repo/api/queries';
import { getLatestAppVersion, getPosSyncStatus } from '@repo/api/fetchers';
import { useSSE } from '@repo/feature/hooks';
import { toast, openConfirmDialog } from '@repo/feature/utils';
import { useDialogStore, usePosOrderStore } from '@repo/feature/stores';
import { SystemControl, Installer } from '@repo/util/app';
import { SSE_KEYS, TIMER_KEYS } from '@/constants/keys';
import { ROUTES } from '@/constants/routes';
import { globalTimerManager } from '@/utils/timerManager';
import { applyMenuboardStateAfterTableOrderHistoriesCleared } from '@/utils/applyMenuboardStateAfterTableOrderHistoriesCleared';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { disconnectSse, initializeSseConnection } from '@/utils/sseConnection';
import { clearAuthData } from '@/utils/auth';
import { getDeviceInfo } from '@/utils/deviceInfo';
import { useTableOrderHistoriesData } from '@/hooks/useTableOrderHistoriesData';
import { useDeviceData } from '@/hooks/useDeviceData';
import { useCategoriesData } from '@/hooks/useCategoriesData';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { useTableGroupData } from '@/hooks/useTableGroupData';
import { useShopThemePage } from './useShopThemePage';
import { usePickupAlarmStore } from '@/stores/usePickupAlarmStore';
import { useModalStore } from '@/stores/useModalStore';
import { useTableGroupStore } from '@/stores/useTableGroupStore';
import { useRequestAdminAccessModalStore } from '@/stores/useRequestAdminAccessModalStore';
import { usePosSyncOverlayStore } from '@/stores/usePosSyncOverlayStore';
import { useShopStore } from '@/stores/useShopStore';

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
  setDeviceStoreDataAsync: (data: Partial<IDevice>) => void | Promise<void>;
  refetchDeviceApi: () => Promise<IDevice | undefined>;
  postDeviceDetail: (req: IPostDeviceDetailRequest) => Promise<unknown>;
  tRef: { current: TFunction };
};

/** POS 동기화 상태 API: 502 + code -102 = 동기화 진행 중 */
const POS_SYNC_POLL_INTERVAL_MS = 60 * 1000;
const POS_SYNC_HTTP_502 = 502;
const POS_SYNC_ERROR_CODE_IN_PROGRESS = -102;

function isPosSyncInProgressError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }
  const err = error as {
    response?: { status?: number; data?: { status?: { code?: number } } };
  };
  return (
    err.response?.status === POS_SYNC_HTTP_502 &&
    err.response?.data?.status?.code === POS_SYNC_ERROR_CODE_IN_PROGRESS
  );
}

/**
 * 디바이스 정보 수집 → 스토어/ref 반영 → 서버 POST
 */
async function collectDeviceInfoAndSyncToServer(
  syncDeps: DeviceDataSyncDeps,
  shopCode: string,
  controlStatus: TControlStatus = null
): Promise<void> {
  const {
    deviceStoreDataRef,
    setDeviceStoreDataAsync,
    refetchDeviceApi,
    postDeviceDetail,
    tRef,
  } = syncDeps;
  const t = tRef.current;
  const existingStoreSnapshot = deviceStoreDataRef.current ?? {};
  const { ipAddress, androidId, appInfo } = await getDeviceInfo({ t });

  if (androidId && !existingStoreSnapshot.androidId) {
    const storeWithAndroidId = { ...existingStoreSnapshot, androidId };
    deviceStoreDataRef.current = storeWithAndroidId;
    await setDeviceStoreDataAsync(storeWithAndroidId as Partial<IDevice>);
  }

  const deviceDetailFromApi = androidId ? await refetchDeviceApi() : null;
  const mergedDeviceDetail = {
    ...existingStoreSnapshot,
    androidId,
    ipAddress,
    version: appInfo.version,
    buildNumber: appInfo.build,
    controlStatus,
    ...(deviceDetailFromApi && {
      deviceType: deviceDetailFromApi.deviceType,
      orderPosNumber: deviceDetailFromApi.orderPosNumber,
      tableNumber:
        deviceDetailFromApi.tableNumber ?? existingStoreSnapshot.tableNumber,
      deviceSeq: deviceDetailFromApi.deviceSeq,
      shopSeq: deviceDetailFromApi.shopSeq,
    }),
  } as DeviceDetailPayload;

  deviceStoreDataRef.current = mergedDeviceDetail;
  await setDeviceStoreDataAsync(mergedDeviceDetail as Partial<IDevice>);

  const resolvedDeviceType = (mergedDeviceDetail.deviceType ??
    'MENU') as TDeviceType;
  const isOrderPosDevice = resolvedDeviceType === 'ORDER_POS';
  await postDeviceDetail({
    shopCode,
    androidId: String(mergedDeviceDetail.androidId ?? ''),
    ipAddress: String(mergedDeviceDetail.ipAddress ?? ''),
    version: String(mergedDeviceDetail.version ?? ''),
    buildNumber: String(mergedDeviceDetail.buildNumber ?? ''),
    deviceType: resolvedDeviceType,
    orderPosNumber: isOrderPosDevice
      ? (mergedDeviceDetail.orderPosNumber ?? null)
      : null,
    tableNumber: isOrderPosDevice
      ? null
      : (mergedDeviceDetail.tableNumber ?? null),
    battery: mergedDeviceDetail.battery ?? 0,
    wifiSignal: mergedDeviceDetail.wifiSignal ?? '0',
    controlStatus: mergedDeviceDetail.controlStatus ?? null,
  });
}

/**
 * SSE(Server-Sent Events) 연결 및 실시간 메시지 처리를 담당하는 커스텀 훅
 *
 * - 디바이스 정보 초기화 후 서버와 SSE 연결
 * - 수신 메시지 타입별 처리 (ORDER, SHOP, MENU, TABLE, DEVICE, PICKUP 등)
 * - useRef로 최신 값 참조하여 불필요한 리렌더/의존성 방지
 * - 언마운트 시 SSE 연결 해제
 *
 * 매장 코드(shopCode)가 있을 때만 SSE 연결을 초기화하며,
 * 메시지 처리는 현재 매장 shopCode와 일치할 때만 수행합니다.
 */
export const useSSEHandler = () => {
  const location = useLocation();
  const { tableNum: tableNumFromParams } = useParams();
  const queryClient = useQueryClient();
  const { t } = useCustomerTranslation();
  const tRef = useRef(t);
  tRef.current = t;

  const { mutateAsync: createDeviceDetail } = usePostDeviceDetail();
  const {
    data: deviceStoreData,
    setDataAsync,
    refresh: refreshDeviceData,
  } = useDeviceData({ skipInitialRequest: true });
  const { data: currentShopData } = useShopStore();
  const { data: sseMessage } = useSSE.useSSEData<ISseMessage>(
    SSE_KEYS.MAIN_CONNECTION
  );
  const { data: shopDetailData, refresh: refreshShopDetailData } =
    useShopDetailData({ skipInitialRequest: true });
  const {
    data: tableOrderHistoriesData,
    refresh: refreshTableOrderHistoriesData,
  } = useTableOrderHistoriesData({ skipInitialRequest: true });
  const { refresh: refreshCategoriesData } = useCategoriesData({
    skipInitialRequest: true,
  });
  const { refresh: refreshTableGroupData, data: tableGroupData } =
    useTableGroupData({ skipInitialRequest: true });
  const { refresh: refreshShopThemePageData } = useShopThemePage({
    skipInitialRequest: true,
  });

  const { data: pickupAlarmData, setData: setPickupAlarm } =
    usePickupAlarmStore();

  // ----- Refs: 최신 값 참조용 (핸들러/effect 내부에서 사용) -----
  const deviceStoreDataRef = useRef(deviceStoreData);
  const sseHandlerDataRef = useRef({
    currentDeviceData: null as typeof deviceStoreData,
    currentShopData: null as typeof currentShopData,
    shopDetailData: null as typeof shopDetailData,
    tableOrderHistoriesData: null as typeof tableOrderHistoriesData,
    tableGroupData: null as typeof tableGroupData,
    pickupAlarmData: null as typeof pickupAlarmData | null,
    locationPathname: location.pathname,
    tableNumFromParams: undefined as string | undefined,
  });
  const pickupAlarmShowingRef = useRef(pickupAlarmData.showPickupAlarm);

  // ----- 디바이스 동기화 의존성 (헬퍼 및 effect에서 사용) -----
  const deviceDataSyncDeps: DeviceDataSyncDeps = {
    deviceStoreDataRef,
    setDeviceStoreDataAsync: setDataAsync,
    refetchDeviceApi: refreshDeviceData,
    postDeviceDetail: createDeviceDetail,
    tRef,
  };

  // ----- Refetch 콜백 (handlersRef에 주입되어 핸들러에서 사용) -----
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

  const stopPosSyncPolling = useCallback(() => {
    globalTimerManager.clear(TIMER_KEYS.POS_SYNC_POLLING);
  }, []);

  const startPosSyncPolling = useCallback(
    (shopCode: string) => {
      globalTimerManager.setTimeout(
        TIMER_KEYS.POS_SYNC_POLLING,
        () => {
          void (async () => {
            try {
              await getPosSyncStatus(shopCode, [POS_SYNC_HTTP_502]);
              stopPosSyncPolling();
              await handlersRef.current.handlePosSyncEndMessage();
            } catch (e) {
              if (isPosSyncInProgressError(e)) {
                startPosSyncPolling(shopCode);
              } else {
                // 싱크 진행 중 에러가 아닌 경우 폴링을 중단하여 무한 루프 방지
                stopPosSyncPolling();
              }
            }
          })();
        },
        POS_SYNC_POLL_INTERVAL_MS
      );
    },
    [stopPosSyncPolling]
  );

  // ----- SSE 메시지 핸들러 Ref (의존성 변경 없이 최신 로직 참조) -----
  const handlersRef = useRef({
    refetchCurrentTableList,
    refetchDeviceList,
    stopPosSyncPolling,
    startPosSyncPolling,

    handleOrderMessage: async (shopCode: string, message: ISseMessage) => {
      if (!message.data) {
        return;
      }

      // 테이블 목록 페이지
      // 현재 테이블 목록 새로고침
      const { locationPathname } = sseHandlerDataRef.current;
      if (locationPathname === ROUTES.TABLES.generate()) {
        handlersRef.current.refetchCurrentTableList(shopCode);
        return;
      }

      const { tableNumFromParams } = sseHandlerDataRef.current;
      // 테이블 상세 페이지
      if (tableNumFromParams) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.orders.tableOrderHistories(
            shopCode,
            tableNumFromParams
          ),
        });
        return;
      }

      const { currentDeviceData } = sseHandlerDataRef.current;
      // 관리자 모드에서 테이블 선택을 안한 상태
      const currentTableNumber = currentDeviceData?.tableNumber;
      if (!currentTableNumber) {
        return;
      }

      if (usePosOrderStore.getState().isWaitingForPosOrderComplete) {
        return;
      }

      const { tableOrderHistoriesData } = sseHandlerDataRef.current;
      const tableNumbersFromSse = message.data as { [key: string]: number };

      // 현재 테이블의 주문이 없는 경우
      // 주문 그룹만 생성되어 있고, 주문이 없는 경우
      if (!(currentTableNumber in tableNumbersFromSse)) {
        const hasExistingOrders =
          tableOrderHistoriesData &&
          tableOrderHistoriesData !== 'isEmptyTable' &&
          (tableOrderHistoriesData?.orderDetailMenuList?.length > 0 ||
            tableOrderHistoriesData?.orderDetailMenuList?.length < 1);
        // pos or 관리자앱에서 주문을 모두 취소 or 테이블 비우기 했을 경우
        if (hasExistingOrders) {
          // POS 콜백 폴링 중이거나 onSuccess/onFailure 처리 중이면 갱신 생략
          if (usePosOrderStore.getState().isWaitingForPosOrderComplete) {
            return;
          }

          refreshTableOrderHistoriesData();
          applyMenuboardStateAfterTableOrderHistoriesCleared(
            sseHandlerDataRef.current.shopDetailData
          );
          return;
        }
        return;
      }

      const sseUpdatedAt = tableNumbersFromSse[currentTableNumber];
      const isOrderUnchanged =
        tableOrderHistoriesData &&
        tableOrderHistoriesData !== 'isEmptyTable' &&
        tableOrderHistoriesData?.sseUpdatedAt === sseUpdatedAt;

      // 주문이 변경되지 않았으면 (중복 처리 방지)
      if (isOrderUnchanged) {
        return;
      }

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

      const totalAmount = refreshResult.totalAmount ?? 0;
      const paidAmount = refreshResult.paymentList
        .filter((payment) => !payment.isCanceled)
        .reduce((sum, payment) => sum + payment.transactionAmount, 0);
      const isFullyPaid = totalAmount > 0 && totalAmount - paidAmount === 0;

      // 결제중이고 결제가 완료되었을 경우
      if (isPaymentModalOpened && isFullyPaid) {
        useModalStore.getState().closeAllModals();
      }
    },

    handleShopMessage: async () => {
      const { locationPathname } = sseHandlerDataRef.current;
      if (locationPathname === ROUTES.LOGIN.path) {
        return;
      }
      await refreshShopDetailData();

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
        useModalStore.getState().closeAllModals();
      }
      useDialogStore.getState().closeAllDialogs();
      toast(tRef.current('매장정보가 업데이트 되었습니다.'), {
        position: 'center-center',
        duration: 1500,
      });
    },

    // MENU 메시지 핸들러: 메뉴 정보 업데이트 처리
    // 테이블 상세 페이지(/tables/:tableNum)에서는 packages/feature 하위에 공통 컴포넌트를 사용하므로,
    // queryClient.refetchQueries 사용하여 update 처리
    handleMenuMessage: () => {
      const {
        locationPathname,
        tableNumFromParams: tableNum,
        currentShopData,
      } = sseHandlerDataRef.current;

      const tableDetailMatch = matchPath(
        { path: ROUTES.TABLES.TABLE_DETAIL.path, end: true },
        locationPathname ?? ''
      );
      const isTableDetailPage =
        tableDetailMatch !== null && !!tableNum && !!currentShopData?.shopCode;

      if (isTableDetailPage) {
        queryClient.refetchQueries({
          queryKey: queryKeys.category.menuboardList(
            currentShopData.shopCode,
            tableNum
          ),
        });
      } else {
        refreshCategoriesData();
      }

      useModalStore.getState().closeMenuDetail();
      toast(tRef.current('메뉴정보가 업데이트 되었습니다.'), {
        position: 'center-center',
        duration: 1500,
      });
    },

    handleTableMessage: async (shopCode: string) => {
      await refreshTableGroupData();
      handlersRef.current.refetchCurrentTableList(shopCode);
      handlersRef.current.refetchDeviceList(shopCode);

      const { currentDeviceData, tableGroupData } = sseHandlerDataRef.current;
      if (!currentDeviceData?.tableNumber) {
        return;
      }

      const currentTableNumber = currentDeviceData.tableNumber;

      // 데이터 업데이트 후 테이블 존재 여부 확인을 위해 약간의 지연
      globalTimerManager.setTimeout(
        TIMER_KEYS.TABLE_REMOVAL_CHECK,
        () => {
          const updatedTableGroupData =
            useTableGroupStore.getState()?.data || tableGroupData;
          const isCurrentTableRemoved =
            !!updatedTableGroupData &&
            !updatedTableGroupData
              .map((tableGroup: ITableGroup) => tableGroup.tableList)
              .flat()
              .some(
                (table: ITableInfo | undefined) =>
                  table?.tableNumber === currentTableNumber
              );

          if (isCurrentTableRemoved) {
            toast(tRef.current('존재하지 않는 테이블입니다.'), {
              position: 'center-center',
              duration: 1500,
            });
            setDataAsync({
              ...currentDeviceData,
              tableNumber: null,
            });
            useRequestAdminAccessModalStore.getState().setShow(true);
          }
        },
        100
      );
    },

    handleDeviceMessage: (shopCode: string) => {
      const { locationPathname } = sseHandlerDataRef.current;
      if (locationPathname !== ROUTES.TABLES.generate()) {
        return;
      }

      handlersRef.current.refetchDeviceList(shopCode);
    },

    handlePickupMessage: (message: ISseMessage) => {
      const { shopDetailData, currentDeviceData, locationPathname } =
        sseHandlerDataRef.current;
      const usePickupAlert =
        shopDetailData?.shopSetting?.usePickupAlert ?? false;

      if (!usePickupAlert) {
        return;
      }
      if (locationPathname !== ROUTES.ROOT.path) {
        return;
      }
      if (!currentDeviceData?.tableNumber || !message?.data) {
        return;
      }
      // 이미 알림이 표시 중이면 중복 표시 방지
      if (pickupAlarmShowingRef.current) {
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
      const { currentDeviceData } = sseHandlerDataRef.current;
      if (!message.data || !currentDeviceData?.androidId) {
        return;
      }
      const targetDeviceIds = message.data as string[];
      const currentAndroidId = currentDeviceData.androidId;
      if (targetDeviceIds.includes(currentAndroidId)) {
        controlAction();
      }
    },

    handleAppOffMessage: (message: ISseMessage) => {
      handlersRef.current.handleDeviceControlMessage(
        () => SystemControl.shutdown(),
        message
      );
    },

    handleDeviceRestartMessage: (message: ISseMessage) => {
      handlersRef.current.handleDeviceControlMessage(async () => {
        try {
          await SystemControl.reboot();
        } catch (e) {
          // app 로그 확인용
          // eslint-disable-next-line no-console
          console.log('DEVICE_RESTART error:', JSON.stringify(e));
          const { currentShopData } = sseHandlerDataRef.current;
          if (currentShopData?.shopCode) {
            await collectDeviceInfoAndSyncToServer(
              deviceDataSyncDeps,
              currentShopData.shopCode,
              'FAIL'
            );
          }
        }
      }, message);
    },

    handleDeviceAppUpdateMessage: async (message: ISseMessage) => {
      const { currentDeviceData, currentShopData } = sseHandlerDataRef.current;
      if (!message.data || !currentDeviceData?.androidId) {
        return;
      }
      const targetDeviceIds = message.data as string[];
      const currentAndroidId = currentDeviceData.androidId;
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
      } catch (e) {
        if (currentShopData?.shopCode) {
          // app 로그 확인용
          // eslint-disable-next-line no-console
          console.log('DEVICE_APP_UPDATE error:', JSON.stringify(e));
          await collectDeviceInfoAndSyncToServer(
            deviceDataSyncDeps,
            currentShopData.shopCode,
            'FAIL'
          );
        }
      }
    },

    handleDeviceScreenOffMessage: (message: ISseMessage) => {
      handlersRef.current.handleDeviceControlMessage(
        () => SystemControl.lockScreen(),
        message
      );
    },

    handleDeviceScreenOnMessage: (message: ISseMessage) => {
      handlersRef.current.handleDeviceControlMessage(
        () => SystemControl.wakeScreen(),
        message
      );
    },

    handleShopThemeMessage: () => {
      refreshShopThemePageData();
    },

    handleLogoutMessage: () => {
      openConfirmDialog({
        title: tRef.current('로그아웃'),
        content: tRef.current(
          '비밀번호가 변경되었습니다. 다시 로그인 해주세요.'
        ),
        primaryText: tRef.current('확인'),
        onConfirm: async () => {
          await clearAuthData();
          window.location.replace(ROUTES.LOGIN.generate());
        },
      });
    },

    handleOrderCompleteMessage: (message: ISseMessage) => {
      const orderUuidFromSse =
        typeof message.data === 'string' ? message.data : null;
      if (!orderUuidFromSse) {
        return;
      }
      usePosOrderStore.getState().handleOrderComplete(orderUuidFromSse);
    },

    handlePosSyncStartMessage: () => {
      usePosSyncOverlayStore.getState().show();
      const shopCode = sseHandlerDataRef.current.currentShopData?.shopCode;
      if (shopCode) {
        handlersRef.current.startPosSyncPolling(shopCode);
      }
    },

    handlePosSyncEndMessage: async () => {
      handlersRef.current.stopPosSyncPolling();
      const { currentShopData } = sseHandlerDataRef.current;
      const shopCode = currentShopData?.shopCode;

      try {
        if (shopCode) {
          await handlersRef.current.handleTableMessage(shopCode);
        }
        handlersRef.current.handleMenuMessage();
      } finally {
        const { locationPathname } = sseHandlerDataRef.current;
        if (locationPathname !== ROUTES.LOGIN.path) {
          await refreshShopDetailData();
        }
        usePosSyncOverlayStore.getState().hide();

        if (locationPathname === ROUTES.ROOT.path) {
          useModalStore.getState().closeAllModals();
          useDialogStore.getState().closeAllDialogs();
        }

        toast(tRef.current('동기화가 완료되었습니다.'), {
          position: 'center-center',
          duration: 1500,
        });
      }
    },
  });

  // ----- Effect: deviceStoreData → deviceStoreDataRef 동기화 -----
  useEffect(() => {
    deviceStoreDataRef.current = deviceStoreData;
  }, [deviceStoreData]);

  // ----- Effect: 데이터/경로 → sseHandlerDataRef 동기화 -----
  useEffect(() => {
    sseHandlerDataRef.current.currentDeviceData = deviceStoreData;
    sseHandlerDataRef.current.currentShopData = currentShopData;
    sseHandlerDataRef.current.shopDetailData = shopDetailData;
    sseHandlerDataRef.current.tableOrderHistoriesData = tableOrderHistoriesData;
    sseHandlerDataRef.current.tableGroupData = tableGroupData;
    sseHandlerDataRef.current.pickupAlarmData = pickupAlarmData;
    sseHandlerDataRef.current.locationPathname = location.pathname;
    sseHandlerDataRef.current.tableNumFromParams = tableNumFromParams;
  }, [
    deviceStoreData,
    currentShopData,
    shopDetailData,
    tableOrderHistoriesData,
    tableGroupData,
    pickupAlarmData,
    location.pathname,
    tableNumFromParams,
  ]);

  // ----- Effect: 픽업 알림 표시 여부 → pickupAlarmShowingRef 동기화 -----
  useEffect(() => {
    pickupAlarmShowingRef.current = pickupAlarmData.showPickupAlarm;
  }, [pickupAlarmData.showPickupAlarm]);

  // ----- Effect: 디바이스 동기화 + SSE 연결 (shopCode 있을 때만) -----
  useEffect(() => {
    if (!currentShopData?.shopCode) {
      return;
    }

    let cancelled = false;

    const run = async () => {
      await collectDeviceInfoAndSyncToServer(
        deviceDataSyncDeps,
        currentShopData.shopCode
      );
      // shopCode가 변경되어 cleanup이 실행된 경우 이전 run이 SSE를 재연결하지 않도록 차단
      if (cancelled) {
        return;
      }
      await initializeSseConnection();
    };

    run();

    return () => {
      cancelled = true;
      globalTimerManager.clear(TIMER_KEYS.TABLE_REMOVAL_CHECK);
      disconnectSse();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- shopCode 기준 1회 실행
  }, [currentShopData?.shopCode]);

  // ----- Effect: 앱 시작 시 POS 동기화 상태 1회 조회 (동기화 중이면 모달+1분 폴링, 아니면 모달 제거) -----
  useEffect(() => {
    const shopCode = currentShopData?.shopCode;
    const isPosLinked =
      !!shopDetailData?.shopSetting?.shopPosCode &&
      shopDetailData?.shopSetting?.shopPosCode !== 'NONE';
    if (!shopCode || !isPosLinked) {
      usePosSyncOverlayStore.getState().hide();
      stopPosSyncPolling();
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        await getPosSyncStatus(shopCode, [POS_SYNC_HTTP_502]);

        if (!cancelled) {
          usePosSyncOverlayStore.getState().hide();
          stopPosSyncPolling();
        }
      } catch (e) {
        if (cancelled) {
          return;
        }

        if (isPosSyncInProgressError(e)) {
          usePosSyncOverlayStore.getState().show();
          startPosSyncPolling(shopCode);
        } else {
          stopPosSyncPolling();
        }
      }
    })();

    return () => {
      cancelled = true;
      stopPosSyncPolling();
    };
  }, [
    currentShopData?.shopCode,
    shopDetailData?.shopSetting?.shopPosCode,
    stopPosSyncPolling,
    startPosSyncPolling,
  ]);

  // ----- Effect: refetch 콜백 → handlersRef 동기화 -----
  useEffect(() => {
    handlersRef.current.refetchCurrentTableList = refetchCurrentTableList;
    handlersRef.current.refetchDeviceList = refetchDeviceList;
  }, [refetchCurrentTableList, refetchDeviceList]);

  // ----- Effect: SSE 메시지 수신 시 타입별 핸들러 실행 -----
  useEffect(() => {
    if (!sseMessage) {
      return;
    }

    const { currentShopData, currentDeviceData } = sseHandlerDataRef.current;
    if (!currentDeviceData || !currentShopData || !currentShopData.shopCode) {
      return;
    }
    if (sseMessage.shopCode !== currentShopData.shopCode) {
      return;
    }

    const shopCode = currentShopData.shopCode;

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
        handlersRef.current.handleAppOffMessage(sseMessage);
        break;
      case 'DEVICE_RESTART':
        handlersRef.current.handleDeviceRestartMessage(sseMessage);
        break;
      case 'DEVICE_APP_UPDATE':
        handlersRef.current.handleDeviceAppUpdateMessage(sseMessage);
        break;
      case 'DEVICE_SCREEN_OFF':
        handlersRef.current.handleDeviceScreenOffMessage(sseMessage);
        break;
      case 'DEVICE_SCREEN_ON':
        handlersRef.current.handleDeviceScreenOnMessage(sseMessage);
        break;
      case 'SHOP_THEME_PAGE':
      case 'SHOP_THEME_MENU':
        handlersRef.current.handleShopThemeMessage();
        break;
      case 'LOGOUT':
        handlersRef.current.handleLogoutMessage();
        break;
      case 'ORDER_COMPLETE':
        handlersRef.current.handleOrderCompleteMessage(sseMessage);
        break;
      case 'POS_SYNC_START':
        handlersRef.current.handlePosSyncStartMessage();
        break;
      case 'POS_SYNC_END':
        handlersRef.current.handlePosSyncEndMessage();
        break;
      default:
        break;
    }
  }, [sseMessage]);
};
