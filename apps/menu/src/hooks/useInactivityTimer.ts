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

export const useInactivityTimer = () => {
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

  useEffect(() => {
    const timerCallback = async () => {
      globalTimerManager.clear(timerKeys.INACTIVITY_TIMEOUT);

      await refreshShopData();
      await refreshShopDetailData();
      await refreshTableData();
      await refreshCategoriesData();
      await refreshTableOrderHistoriesData();
      await refreshTableGroupData();
      clearCart();
      clearLanguageData();
      clearCustomerCountData();
      //TODO: 추후 주석 제거 예정
      // window.location.reload();
    };

    const startTimer = () => {
      // 이미 타이머 실행 중이면 제거
      globalTimerManager.clear(timerKeys.INACTIVITY_TIMEOUT);

      globalTimerManager.setTimeout(
        timerKeys.INACTIVITY_TIMEOUT,
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
      globalTimerManager.clear(timerKeys.INACTIVITY_TIMEOUT);
    };
  }, []);
};
