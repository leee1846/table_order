import { create } from '@repo/feature/zustand';

interface IPosAgentErrorStore {
  isOpen: boolean;
  closeTrigger: boolean;
  openError: () => void;
  closeError: () => void;
}

/**
 * POS 에이전트 연결 오류 모달 상태를 관리하는 스토어
 */
export const usePosAgentErrorStore = create<IPosAgentErrorStore>((set) => ({
  isOpen: false,
  closeTrigger: false,
  openError: () => {
    set({ isOpen: true });
  },
  closeError: () => {
    set((state) => ({ isOpen: false, closeTrigger: !state.closeTrigger }));
  },
}));
