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
  clearData: () => void;
}

/**
 * 초기 화면 노출 상태 저장 스토어
 */
export const useInitialPageStore = create<IInitialPageStore>((set) => {
  // 초기 데이터 로드 (비동기)
  AppStorage.loadData<boolean>({ key: STORAGE_KEYS.INITIAL_PAGE_SHOW }).then(
    (data) => {
      if (data?.value !== null && data.value !== undefined) {
        set({ data: { showInitialPage: data.value } });
      }
    }
  );

  return {
    data: {
      showInitialPage: true,
    },
    showInitialPage: () => {
      AppStorage.saveData({
        key: STORAGE_KEYS.INITIAL_PAGE_SHOW,
        value: true,
        isTemporary: true,
      });
      set({ data: { showInitialPage: true } });
    },
    hideInitialPage: () => {
      AppStorage.saveData({
        key: STORAGE_KEYS.INITIAL_PAGE_SHOW,
        value: false,
        isTemporary: true,
      });
      set({ data: { showInitialPage: false } });
    },
    clearData: () => {
      AppStorage.removeData({
        key: STORAGE_KEYS.INITIAL_PAGE_SHOW,
      });
      set({ data: { showInitialPage: true } });
    },
  };
});
