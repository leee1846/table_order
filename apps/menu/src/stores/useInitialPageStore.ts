import { STORAGE_KEYS } from '@/constants/keys';
import storage from '@/utils/storage';
import { create } from '@repo/feature/zustand';

interface IInitialPageStore {
  data: {
    // 초기 화면 노출 여부
    showInitialPage: boolean;
  };
  showInitialPage: () => void;
  hideInitialPage: () => void;
}

/**
 * 초기 화면 노출 상태 저장 스토어
 */
export const useInitialPageStore = create<IInitialPageStore>((set) => ({
  data: {
    showInitialPage:
      storage.load<boolean>(STORAGE_KEYS.INITIAL_PAGE_SHOW) ?? true,
  },
  showInitialPage: () => {
    storage.save(STORAGE_KEYS.INITIAL_PAGE_SHOW, true);
    set({ data: { showInitialPage: true } });
  },
  hideInitialPage: () => {
    storage.save(STORAGE_KEYS.INITIAL_PAGE_SHOW, false);
    set({ data: { showInitialPage: false } });
  },
}));
