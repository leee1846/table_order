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
 * 장바구니 알림 상태 저장 스토어
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
