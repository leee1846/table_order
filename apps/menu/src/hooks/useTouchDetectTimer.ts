import { useEffect } from 'react';
import { globalTimerManager } from '@/utils/timerManager';
import { timerKeys } from '@/constants/keys';
import { useShopData } from '@/hooks/useShopData';
import { useShopDetailData } from './useShopDetailData';
import { useTableData } from './useTableData';
import { useCategoriesData } from './useCategoriesData';
import { useTableOrderHistoriesData } from './useTableOrderHistoriesData';
import { useCartStore } from '@/stores/useCartStore';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { useCustomerCountStore } from '@/stores/useCustomerCountStore';
import { useTableGroupData } from './useTableGroupData';
import { useInitialPageStore } from '@/stores/useInitialPageStore';

export const useTouchDetectTimer = () => {
  const { refresh: refreshShopData } = useShopData();
  const { refresh: refreshShopDetailData } = useShopDetailData();
  const { refresh: refreshTableData } = useTableData();
  const { refresh: refreshCategoriesData } = useCategoriesData();
  const { refresh: refreshTableOrderHistoriesData } =
    useTableOrderHistoriesData();
  const { refresh: refreshTableGroupData } = useTableGroupData();
  const { clearCart } = useCartStore();
  const { clearData: clearLanguageData } = useLanguageStore();
  const { clearData: clearCustomerCountData } = useCustomerCountStore();
  const { showInitialPage } = useInitialPageStore();

  useEffect(() => {
    const timerCallback = async () => {
      globalTimerManager.clear(timerKeys.TOUCH_DETECT_TIMEOUT);

      await refreshShopData();
      await refreshShopDetailData();
      await refreshTableData();
      await refreshCategoriesData();
      const newTableOrderHistoriesData = await refreshTableOrderHistoriesData();
      await refreshTableGroupData();
      clearCart();

      if (
        newTableOrderHistoriesData &&
        newTableOrderHistoriesData.orderDetailMenuList.length < 1
      ) {
        clearCustomerCountData();
        clearLanguageData();
        showInitialPage();
      }

      //TODO: 추후 주석 제거 예정
      // window.location.reload();
    };

    const startTimer = () => {
      // 이미 타이머 실행 중이면 제거
      globalTimerManager.clear(timerKeys.TOUCH_DETECT_TIMEOUT);

      globalTimerManager.setTimeout(
        timerKeys.TOUCH_DETECT_TIMEOUT,
        timerCallback,
        150000 // 2분 30초
      );
    };

    const restartTimer = () => {
      startTimer();
    };

    // 초기 시작
    startTimer();

    // 터치 발생 시 다시 시작
    const handleTouch = () => restartTimer();

    document.addEventListener('touchstart', handleTouch, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouch);
      globalTimerManager.clear(timerKeys.TOUCH_DETECT_TIMEOUT);
    };
  }, []);
};
