import { useEffect } from 'react';
import { useCartStore } from '@/stores/useCartStore';

interface BreakTimeState {
  showBreakTime: boolean;
  isBreakTimeLastOrder: boolean;
  isBreakTimeLastOrderAlert: boolean;
  breakTimeMessage: string | null;
  breakTimeLastOrderMessage: string | null;
  breakTimeStartTime: string | null;
  breakTimeEndTime: string | null;
  lastOrderTime: string | null;
}

/**
 * 브레이크타임 시작 시 장바구니를 클리어함
 *
 * @param breakTimeState - 브레이크타임 상태
 */
export const useBreakTimeCartClear = (breakTimeState: BreakTimeState): void => {
  const { clearCart } = useCartStore();

  useEffect(() => {
    if (!breakTimeState.showBreakTime && !breakTimeState.isBreakTimeLastOrder) {
      return;
    }

    clearCart();
  }, [
    breakTimeState.showBreakTime,
    breakTimeState.isBreakTimeLastOrder,
    clearCart,
  ]);
};
