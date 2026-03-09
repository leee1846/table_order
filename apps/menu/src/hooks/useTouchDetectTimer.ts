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
  const { refresh: refreshShopDetailData } = useShopDetailData();
  const { refresh: refreshCategoriesData } = useCategoriesData();
  const { refresh: refreshDeviceData } = useDeviceData();
  const { refresh: refreshTableOrderHistoriesData } =
    useTableOrderHistoriesData();
  const { refresh: refreshTableGroupData } = useTableGroupData();
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

  const { data: cartData, clearCart } = useCartStore();
  const { clearData: clearLanguageData } = useCustomerLanguageStore();
  const { clearData: clearCustomerCountData } = useCustomerCountStore();
  const { showInitialPage } = useInitialPageStore();
  const { showCartReminder } = useCartReminderStore();
  const { isAllModalsClosed } = useModalStore();

  // cartData는 장바구니 변경마다 새 객체가 생성되어 effect가 재실행되어 타이머/리스너가 불필요하게 재등록되는 문제 방지
  const cartDataRef = useRef(cartData);
  cartDataRef.current = cartData;

  useEffect(() => {
    const timerCallback = async () => {
      globalTimerManager.clear(TIMER_KEYS.API_RESET_TIMEOUT);

      try {
        // 모달이 하나라도 열려 있으면 새로고침하지 않음 (분할 결제 등 진행 중 방지)
        if (!isAllModalsClosed()) {
          return;
        }

        await refreshShopDetailDataRef.current();
        await refreshCategoriesDataRef.current();
        await refreshTableGroupDataRef.current();
        await refreshDeviceDataRef.current();
        await refreshShopThemePageDataRef.current();

        // 장바구니 비우기
        clearCart();
        const newTableOrderHistoriesData =
          await refreshTableOrderHistoriesDataRef.current();

        // 테이블이 점유되지 않았을경우
        if (newTableOrderHistoriesData === null) {
          // 객수 선택 초기화
          clearCustomerCountData();
          // 언어 선택 초기화
          clearLanguageData();
          showInitialPage();
        }

        // await SystemControl.deepCleanAndReload();
      } catch {
        // TimerManager는 async 콜백의 Promise를 await하지 않으므로
        // throw가 나면 Unhandled Rejection → 웹뷰 앱 종료로 이어질 수 있음
      }
    };

    const startResetTimer = () => {
      // 모달이 열려 있으면 리셋 타이머를 시작하지 않음
      if (!isAllModalsClosed()) {
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
      if (!isAllModalsClosed()) {
        return;
      }
      showCartReminder();
    };

    const startOrderReminderTimer = () => {
      if (cartDataRef.current.menus.length < 1) {
        return;
      }

      // 모든 modal이 닫혀있는지 확인
      if (!isAllModalsClosed()) {
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
    // 객체 참조만 바뀌는 경우에는 effect가 불필요하게 재실행되지 않도록 함
    cartData.menus.length,
    isAllModalsClosed,
    showCartReminder,
    showInitialPage,
    clearCart,
    clearCustomerCountData,
    clearLanguageData,
  ]);
};
