import { STORAGE_KEYS } from '@/constants/keys';
import { AppStorage } from '@repo/util/app';
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
export const useInitialPageStore = create<IInitialPageStore>((set) => {
  // 초기 데이터 로드 (비동기)
  AppStorage.loadData<boolean>(STORAGE_KEYS.INITIAL_PAGE_SHOW).then((data) => {
    if (data !== null) {
      set({ data: { showInitialPage: data } });
    }
  });

  return {
    data: {
      showInitialPage: true,
    },
    showInitialPage: () => {
      AppStorage.saveData(STORAGE_KEYS.INITIAL_PAGE_SHOW, true);
      set({ data: { showInitialPage: true } });
    },
    hideInitialPage: () => {
      AppStorage.saveData(STORAGE_KEYS.INITIAL_PAGE_SHOW, false);
      set({ data: { showInitialPage: false } });
    },
  };
});
