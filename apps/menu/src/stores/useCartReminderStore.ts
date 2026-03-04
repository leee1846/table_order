import { create } from '@repo/feature/zustand';

interface ICartReminderStore {
  data: {
    showCartReminder: boolean;
  };
  showCartReminder: () => void;
  hideCartReminder: () => void;
  clearData: () => void;
}
/**
 * 장바구니 주문 알림 상태를 관리하는 Zustand 스토어
 *
 * @description
 * - 장바구니에 메뉴가 담겨있을 때 주문 알림 표시 여부를 관리합니다
 * - 일정 시간 동안 주문이 없을 때 알림을 표시하기 위해 사용됩니다
 */
export const useCartReminderStore = create<ICartReminderStore>((set) => ({
  data: {
    showCartReminder: false,
  },
  showCartReminder: () => {
    set({ data: { showCartReminder: true } });
  },
  hideCartReminder: () => {
    set({ data: { showCartReminder: false } });
  },
  clearData: () => {
    set({ data: { showCartReminder: false } });
  },
}));
