import { create } from '@repo/feature/zustand';

interface IPosErrorStore {
  isOpen: boolean;
  openError: () => void;
  closeError: () => void;
}

/**
 * POS 에러 모달 상태를 관리하는 스토어
 */
export const usePosErrorStore = create<IPosErrorStore>((set) => ({
  isOpen: false,
  openError: () => {
    set({ isOpen: true });
  },
  closeError: () => {
    set({ isOpen: false });
  },
}));
