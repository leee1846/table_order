import { create } from '@repo/feature/zustand';

interface ITheftAlertStore {
  isOpen: boolean;
  tableNumber: string;
  openAlert: (tableNumber: string) => void;
  closeAlert: () => void;
}

/**
 * 기기 도난 알림 상태를 관리하는 스토어
 */
export const useTheftAlertStore = create<ITheftAlertStore>((set) => ({
  isOpen: false,
  tableNumber: '',
  openAlert: (tableNumber: string) => {
    set({ isOpen: true, tableNumber });
  },
  closeAlert: () => {
    set({ isOpen: false, tableNumber: '' });
  },
}));
