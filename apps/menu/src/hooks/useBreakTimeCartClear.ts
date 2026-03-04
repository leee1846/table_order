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
 * 브레이크타임 시작 시 장바구니를 자동으로 클리어하는 커스텀 훅
 *
 * @description
 * - 브레이크타임이 시작되거나 라스트오더 시간이 되면 장바구니를 자동으로 비웁니다
 *
 * @param breakTimeState - 브레이크타임 상태 정보
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
