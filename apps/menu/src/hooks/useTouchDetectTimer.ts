import { useEffect, useRef } from 'react';
import { globalTimerManager } from '@/utils/timerManager';
import { TIMER_KEYS } from '@/constants/keys';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { useCategoriesData } from '@/hooks/useCategoriesData';
import { useTableOrderHistoriesData } from '@/hooks/useTableOrderHistoriesData';
import { useCartStore } from '@/stores/useCartStore';
import { useCustomerLanguageStore } from '@/stores/useCustomerLanguageStore';
import { useCustomerCountStore } from '@/stores/useCustomerCountStore';
import { useTableGroupData } from '@/hooks/useTableGroupData';
import { useInitialPageStore } from '@/stores/useInitialPageStore';
import { useCartReminderStore } from '@/stores/useCartReminderStore';
import { useStandbyAdStore } from '@/stores/useStandbyAdStore';
import { useDeviceData } from '@/hooks/useDeviceData';
import { useModalStore } from '@/stores/useModalStore';
import { useShopThemePage } from '@/hooks/useShopThemePage';

/**
 * 터치 감지 및 자동 리셋 타이머를 관리하는 커스텀 훅
 *
 * @description
 * - 2분 30초 동안 터치가 없으면 모든 데이터를 새로고침하고 페이지를 리로드합니다
 * - 장바구니에 메뉴가 있고 모든 모달이 닫혀있으면 1분 30초 후 주문 알림을 표시합니다
 * - 터치 이벤트 발생 시 타이머를 재시작합니다
 * - refresh 함수들은 ref로만 참조하여, device API 등 외부 리렌더로 인한 effect 재실행(타이머 재계산)을 방지합니다.
 */
export const useTouchDetectTimer = () => {
  const { refresh: refreshShopDetailData } = useShopDetailData({
    skipInitialRequest: true,
  });
  const { refresh: refreshCategoriesData } = useCategoriesData({
    skipInitialRequest: true,
  });
  const { refresh: refreshDeviceData } = useDeviceData({
    skipInitialRequest: true,
  });
  const { refresh: refreshTableOrderHistoriesData } =
    useTableOrderHistoriesData({ skipInitialRequest: true });
  const { refresh: refreshTableGroupData } = useTableGroupData({
    skipInitialRequest: true,
  });
  const { refresh: refreshShopThemePageData } = useShopThemePage();

  const refreshShopDetailDataRef = useRef(refreshShopDetailData);
  const refreshCategoriesDataRef = useRef(refreshCategoriesData);
  const refreshDeviceDataRef = useRef(refreshDeviceData);
  const refreshTableOrderHistoriesDataRef = useRef(
    refreshTableOrderHistoriesData
  );
  const refreshTableGroupDataRef = useRef(refreshTableGroupData);
  const refreshShopThemePageDataRef = useRef(refreshShopThemePageData);

  refreshShopDetailDataRef.current = refreshShopDetailData;
  refreshCategoriesDataRef.current = refreshCategoriesData;
  refreshDeviceDataRef.current = refreshDeviceData;
  refreshTableOrderHistoriesDataRef.current = refreshTableOrderHistoriesData;
  refreshTableGroupDataRef.current = refreshTableGroupData;
  refreshShopThemePageDataRef.current = refreshShopThemePageData;

  const cartMenuCount = useCartStore((s) => s.data.menus.length);
  const clearCart = useCartStore((s) => s.clearCart);
  const { setData: setLanguageData } = useCustomerLanguageStore();
  const { clearData: clearCustomerCountData } = useCustomerCountStore();
  const { showCartReminder } = useCartReminderStore();

  useEffect(() => {
    const timerCallback = async () => {
      globalTimerManager.clear(TIMER_KEYS.API_RESET_TIMEOUT);

      try {
        // 모달이 하나라도 열려 있으면 새로고침하지 않음 (분할 결제 등 진행 중 방지)
        if (!useModalStore.getState().isAllModalsClosed()) {
          return;
        }

        const newShopDetailData = await refreshShopDetailDataRef.current();
        await refreshCategoriesDataRef.current();
        await refreshTableGroupDataRef.current();
        await refreshDeviceDataRef.current();
        await refreshShopThemePageDataRef.current();

        // 장바구니 비우기
        clearCart();
        useModalStore.getState().closeAllModals();

        const newTableOrderHistoriesData =
          await refreshTableOrderHistoriesDataRef.current();

        const isNoExistingOrders =
          (newTableOrderHistoriesData?.orderDetailMenuList?.length ?? 0) < 1;
        // 이미 주문이 존재하면 언어·초기 화면을 리셋하지 않음
        if (isNoExistingOrders) {
          // TODO
          // 여기서 주문그룹 제거하는 api 요청해야함
          // 그리고 아래 로직은 SSE CLEAR에서 동작해야함함
          // 객수 선택 초기화
          clearCustomerCountData();
          // 매장 기본 언어로 초기화 (KO 고정 대신 shopLanguage 사용)
          setLanguageData({
            currentLanguage:
              newShopDetailData?.shopSetting?.shopLanguage ?? 'KO',
            isSelected: false,
          });
          useStandbyAdStore.getState().openStandbyAd();
          useInitialPageStore.getState().showInitialPage();
        }

        // await SystemControl.deepCleanAndReload();
      } catch {
        // TimerManager는 async 콜백의 Promise를 await하지 않으므로
        // throw가 나면 Unhandled Rejection → 웹뷰 앱 종료로 이어질 수 있음
      }
    };

    const startResetTimer = () => {
      // 모달이 열려 있으면 리셋 타이머를 시작하지 않음
      if (!useModalStore.getState().isAllModalsClosed()) {
        return;
      }
      // 이미 타이머 실행 중이면 제거
      globalTimerManager.clear(TIMER_KEYS.API_RESET_TIMEOUT);
      globalTimerManager.setTimeout(
        TIMER_KEYS.API_RESET_TIMEOUT,
        timerCallback,
        150000 // 2분 30초
      );
    };

    const orderReminderTimerCallback = () => {
      globalTimerManager.clear(TIMER_KEYS.CART_ORDER_REMINDER);
      // 타이머 만료 시점에 다시 한 번 모달 상태 확인 (열린 모달 위에 노출 방지)
      if (!useModalStore.getState().isAllModalsClosed()) {
        return;
      }
      showCartReminder();
    };

    const startOrderReminderTimer = () => {
      if (useCartStore.getState().data.menus.length < 1) {
        return;
      }

      // 모든 modal이 닫혀있는지 확인
      if (!useModalStore.getState().isAllModalsClosed()) {
        return;
      }

      globalTimerManager.clear(TIMER_KEYS.CART_ORDER_REMINDER);

      globalTimerManager.setTimeout(
        TIMER_KEYS.CART_ORDER_REMINDER,
        orderReminderTimerCallback,
        90000 // 1분 30초
      );
    };
    // 초기 시작
    startResetTimer();
    startOrderReminderTimer();

    // 터치 발생 시 다시 시작
    const handleTouch = () => {
      startResetTimer();
      startOrderReminderTimer();
    };

    document.addEventListener('touchstart', handleTouch, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouch);
      globalTimerManager.clear(TIMER_KEYS.API_RESET_TIMEOUT);
      globalTimerManager.clear(TIMER_KEYS.CART_ORDER_REMINDER);
    };
  }, [
    cartMenuCount,
    showCartReminder,
    clearCart,
    clearCustomerCountData,
    setLanguageData,
  ]);
};
