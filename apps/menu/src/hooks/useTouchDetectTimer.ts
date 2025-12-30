import { useEffect } from 'react';
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

export const useTouchDetectTimer = () => {
  const { refresh: refreshShopDetailData } = useShopDetailData();
  const { refresh: refreshCategoriesData } = useCategoriesData();
  const { refresh: refreshDeviceData } = useDeviceData();
  const { refresh: refreshTableOrderHistoriesData } =
    useTableOrderHistoriesData();

  const { refresh: refreshTableGroupData } = useTableGroupData();
  const { data: cartData, clearCart } = useCartStore();
  const { clearData: clearLanguageData } = useCustomerLanguageStore();
  const { clearData: clearCustomerCountData } = useCustomerCountStore();
  const { showInitialPage } = useInitialPageStore();
  const { showCartReminder } = useCartReminderStore();

  useEffect(() => {
    const timerCallback = async () => {
      globalTimerManager.clear(TIMER_KEYS.API_RESET_TIMEOUT);

      // 상점 상세 데이터 api 요청
      await refreshShopDetailData();
      // 메뉴 카테고리 api 요청
      await refreshCategoriesData();
      // 테이블 그룹 데이터 api 요청
      await refreshTableGroupData();
      // 디바이스 데이터 api 요청
      await refreshDeviceData();

      // 장바구니 비우기
      clearCart();
      const newTableOrderHistoriesData = await refreshTableOrderHistoriesData();

      // 테이블이 점유되지 않았을경우
      if (newTableOrderHistoriesData === null) {
        // 객수 선택 초기화
        clearCustomerCountData();
        // 언어 선택 초기화
        clearLanguageData();
        // 초기 화면 노출
        showInitialPage();
      }

      window.location.reload();
    };

    const startResetTimer = () => {
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
      showCartReminder();
    };

    const startOrderReminderTimer = () => {
      if (cartData.menus.length < 1) {
        return;
      }

      globalTimerManager.clear(TIMER_KEYS.CART_ORDER_REMINDER);

      globalTimerManager.setTimeout(
        TIMER_KEYS.CART_ORDER_REMINDER,
        orderReminderTimerCallback,
        120000 // 2분
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
    cartData,
    showCartReminder,
    showInitialPage,
    clearCart,
    clearCustomerCountData,
    clearLanguageData,
    refreshShopDetailData,
    refreshCategoriesData,
    refreshTableOrderHistoriesData,
    refreshTableGroupData,
    refreshDeviceData,
  ]);
};
