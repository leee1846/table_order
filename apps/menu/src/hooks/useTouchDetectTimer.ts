import { useEffect } from 'react';
import { globalTimerManager } from '@/utils/timerManager';
import { timerKeys } from '@/constants/keys';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { useCategoriesData } from '@/hooks/useCategoriesData';
import { useTableOrderHistoriesData } from '@/hooks/useTableOrderHistoriesData';
import { useCartStore } from '@/stores/useCartStore';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { useCustomerCountStore } from '@/stores/useCustomerCountStore';
import { useTableGroupData } from '@/hooks/useTableGroupData';
import { useInitialPageStore } from '@/stores/useInitialPageStore';
import { useCartReminderStore } from '@/stores/useCartReminderStore';

export const useTouchDetectTimer = () => {
  const { refresh: refreshShopDetailData } = useShopDetailData();
  const { refresh: refreshCategoriesData } = useCategoriesData();
  const { refresh: refreshTableOrderHistoriesData } =
    useTableOrderHistoriesData();
  const { refresh: refreshTableGroupData } = useTableGroupData();
  const { data: cartData, clearCart } = useCartStore();
  const { clearData: clearLanguageData } = useLanguageStore();
  const { clearData: clearCustomerCountData } = useCustomerCountStore();
  const { showInitialPage } = useInitialPageStore();
  const { showCartReminder } = useCartReminderStore();

  useEffect(() => {
    const timerCallback = async () => {
      globalTimerManager.clear(timerKeys.TOUCH_DETECT_TIMEOUT);

      // 상점 상세 데이터 api 요청
      await refreshShopDetailData();
      // 메뉴 카테고리 api 요청
      await refreshCategoriesData();
      // 테이블 그룹 데이터 api 요청
      await refreshTableGroupData();
      // 장바구니 비우기
      clearCart();
      const newTableOrderHistoriesData = await refreshTableOrderHistoriesData();

      // 주문 내역이 없을경우
      if (
        newTableOrderHistoriesData &&
        newTableOrderHistoriesData.orderDetailMenuList.length < 1
      ) {
        // 객수 선택 초기화
        clearCustomerCountData();
        // 언어 선택 초기화
        clearLanguageData();
        // 초기 화면 노출
        showInitialPage();
      }

      //TODO: 추후 주석 제거 예정
      // window.location.reload();
    };

    const startResetTimer = () => {
      // 이미 타이머 실행 중이면 제거
      globalTimerManager.clear(timerKeys.TOUCH_DETECT_TIMEOUT);
      globalTimerManager.setTimeout(
        timerKeys.TOUCH_DETECT_TIMEOUT,
        timerCallback,
        150000 // 2분 30초
      );
    };

    const orderReminderTimerCallback = () => {
      globalTimerManager.clear(timerKeys.TOUCH_AFTER_TIMEOUT);
      showCartReminder();
    };

    const startOrderReminderTimer = () => {
      if (cartData.menus.length < 1) {
        return;
      }

      globalTimerManager.clear(timerKeys.TOUCH_AFTER_TIMEOUT);
      globalTimerManager.setTimeout(
        timerKeys.TOUCH_AFTER_TIMEOUT,
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
      globalTimerManager.clear(timerKeys.TOUCH_DETECT_TIMEOUT);
      globalTimerManager.clear(timerKeys.TOUCH_AFTER_TIMEOUT);
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
  ]);
};
