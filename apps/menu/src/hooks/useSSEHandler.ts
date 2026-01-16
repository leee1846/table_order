import { useCallback, useEffect, useRef } from 'react';
import { disconnectSse, initializeSseConnection } from '@/utils/sseConnection';
import { useSSE } from '@repo/feature/hooks';
import { SSE_KEYS, STORAGE_KEYS } from '@/constants/keys';
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
import { SystemControl, AppStorage } from '@repo/util/app';
import { useModalStore } from '@/stores/useModalStore';
import { toast, openConfirmDialog } from '@repo/feature/utils';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { useInitialPageStore } from '@/stores/useInitialPageStore';
import { useCartStore } from '@/stores/useCartStore';
import { useCustomerCountStore } from '@/stores/useCustomerCountStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useTableGroupStore } from '@/stores/useTableGroupStore';
import { useShopThemePage } from './useShopThemePage';
import { useDialogStore } from '@repo/feature/stores';
import { clearAuthData } from '@/utils/auth';
import { getDeviceInfo } from '@/utils/deviceInfo';

/**
 * SSE(Server-Sent Events) 연결 및 실시간 메시지 처리를 담당하는 커스텀 훅
 *
 * @description
 * 이 훅은 메뉴 앱에서 서버와의 실시간 통신을 관리하며, 다음과 같은 주요 기능을 제공합니다:
 *
 * ## 주요 기능
 *
 * 1. 디바이스 정보 초기화 및 SSE 연결 설정
 * 2. 실시간 메시지 타입별 처리
 * 3. `useRef`를 활용한 데이터 참조 관리로 불필요한 리렌더링 방지
 * 4. 컴포넌트 언마운트 시 SSE 연결 자동 해제
 *
 * @remarks
 * - 이 훅은 `currentShopData.shopCode`가 존재할 때만 SSE 연결을 초기화합니다.
 * - 모든 메시지 처리는 현재 매장의 shopCode와 일치하는 경우에만 수행됩니다.
 * - 디바이스 정보 수집 실패 시 사용자에게 재시도 다이얼로그를 표시합니다.
 */
export const useSSEHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  // i18n: 고객용 번역 함수
  const { t } = useCustomerTranslation();

  const { mutateAsync: postDeviceDetail } = usePostDeviceDetail();
  const {
    data: deviceStoreData,
    setDataAsync,
    refresh: refreshDeviceData,
  } = useDeviceData({
    skipInitialRequest: true,
  });
  const { shopData: currentShopData } = useShopData({
    skipInitialRequest: true,
  });

  // 최신 deviceStoreData 값을 참조하기 위한 ref (비동기 함수에서 최신 값 참조용)
  const deviceStoreDataRef = useRef(deviceStoreData);

  // deviceStoreData 변경 시 ref 동기화 (렌더링 없이 최신 값 유지)
  useEffect(() => {
    deviceStoreDataRef.current = deviceStoreData;
  }, [deviceStoreData]);

  // 초기 디바이스 데이터 설정 및 SSE 연결
  // shopCode가 변경될 때마다 디바이스 정보 수집 및 SSE 연결 초기화
  useEffect(() => {
    if (!currentShopData?.shopCode) {
      return;
    }

    const getDeviceData = async () => {
      // AndroidInfo에서 기기 정보 가져오기 (androidId가 필요하므로 먼저 실행)
      const { ipAddress, androidId, appInfo } = await getDeviceInfo({ t });

      // androidId를 얻었으므로, 먼저 GET 요청을 통해 서버에서 최신 device 데이터를 가져옴
      let fetchedDeviceData = null;
      if (androidId) {
        // androidId를 먼저 저장해서 refreshDeviceData가 동작하도록 함
        const currentDeviceStoreData = deviceStoreDataRef.current;
        if (!currentDeviceStoreData?.androidId) {
          await setDataAsync({
            ...(currentDeviceStoreData ?? {}),
            androidId,
          });
          deviceStoreDataRef.current = {
            ...(currentDeviceStoreData ?? {}),
            androidId,
          };
        }

        // 서버에서 최신 디바이스 데이터 조회
        fetchedDeviceData = await refreshDeviceData();
        if (fetchedDeviceData) {
          deviceStoreDataRef.current = fetchedDeviceData;
        }
      }

      const currentDeviceStoreData =
        fetchedDeviceData ?? deviceStoreDataRef.current;

      const baseDeviceDetail = {
        ...(currentDeviceStoreData ?? {}),
        ipAddress,
        androidId,
        version: appInfo.version,
        buildNumber: appInfo.build,
      };

      await setDataAsync(baseDeviceDetail);

      // 서버에 디바이스 정보 동기화 (기본값 설정 포함)
      await postDeviceDetail({
        shopCode: currentShopData.shopCode,
        ...baseDeviceDetail,
        deviceType: baseDeviceDetail.deviceType ?? 'MENU',
        orderPosNumber: baseDeviceDetail.orderPosNumber ?? null,
        tableNumber: baseDeviceDetail.tableNumber ?? null,
        battery: baseDeviceDetail.battery ?? 0,
        wifiSignal: baseDeviceDetail.wifiSignal ?? '',
      });

      // SSE 연결 초기화 (서버와 실시간 통신 시작)
      await initializeSseConnection();
    };

    // 비동기 함수 실행 (fire and forget)
    getDeviceData();

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

      // 현재 테이블이 주문 목록에 없으면 (주문 삭제됨)
      if (!(currentTableNumber in orderDataByTable)) {
        const hasExistingOrders =
          tableOrderHistoriesData &&
          tableOrderHistoriesData !== 'isEmptyTable' &&
          tableOrderHistoriesData?.orderDetailMenuList?.length > 0;

        // 기존 주문이 있었다면 모든 상태 초기화
        if (hasExistingOrders) {
          refreshTableOrderHistoriesData(); // 주문 내역 새로고침
          clearInitialPage(); // 초기 페이지 데이터 초기화
          clearCart(); // 장바구니 초기화
          clearCustomerCountData(); // 고객 수 초기화
          useModalStore.getState().closeAllModals(); // 모든 모달 닫기
          useDialogStore.getState().closeAllDialogs(); // 모든 다이얼로그 닫기
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

      // 현금 결제 유도 모달이 열려있는지 확인
      const isCashPaymentInducementModalOpened =
        useModalStore.getState().data.isCashPaymentInducementModalOpened;
      // 현금 결제 유도 모달이 열려있으면 주문 내역 새로고침
      if (isCashPaymentInducementModalOpened) {
        // totalAmount 계산 (null이면 0으로 처리)
        const totalAmount = refreshResult.totalAmount ?? 0;

        // paymentList에서 isCanceled가 false인 항목들의 transactionAmount 합계 계산
        const paidAmount = refreshResult.paymentList
          .filter((payment) => !payment.isCanceled)
          .reduce((sum, payment) => sum + payment.transactionAmount, 0);

        // 모든 주문금액 결제가 완료 되었을경우
        if (totalAmount - paidAmount === 0) {
          // 현금 결제 유도 모달 닫기
          useModalStore.getState().closeAllModals();
        }
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
      window.location.reload();
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

      const { currentDeviceData, tableGroupData, locationPathname } =
        dataRefs.current;

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
          // 루트 페이지에 있으면 테이블 선택 페이지로 이동
          if (locationPathname === ROUTES.ROOT.path) {
            navigate(ROUTES.TABLES.generate(), { replace: true });
          }
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

      case 'DEVICE_OFF':
        // 앱 종료 제어
        handlersRef.current.handleDeviceControlMessage(() => {
          SystemControl.exitApp();
        }, sseMessage);
        break;

      case 'DEVICE_RESTART':
        // 기기 재시작 제어
        handlersRef.current.handleDeviceControlMessage(() => {
          SystemControl.reboot();
        }, sseMessage);
        break;

      case 'DEVICE_APP_UPDATE':
        // 앱 업데이트 제어 (TODO: 구현 필요)
        handlersRef.current.handleDeviceControlMessage(() => {
          // TODO: 앱 업데이트 브릿지 호출 필요
        }, sseMessage);
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
  }, [sseMessage]); // sseMessage만 dependency에 포함 (다른 데이터는 ref로 참조)
};
