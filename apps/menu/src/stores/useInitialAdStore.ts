import { create } from '@repo/feature/zustand';

interface IInitialAdStore {
  data: {
    /** 전면 대기 광고 노출 여부 */
    showInitialAd: boolean;
  };
  showInitialAd: () => void;
  hideInitialAd: () => void;
  clearData: () => void;
}

/**
 * 전면 대기 광고 노출 여부를 관리하는 Zustand 스토어
 *
 * @description
 * - showInitialPage() 호출 시 InitialPage 직전에 노출되는 전면 광고의 가시성을 관리합니다
 * - 세션 내 상태만 관리하므로 AppStorage에 저장하지 않습니다
 */
export const useInitialAdStore = create<IInitialAdStore>((set) => ({
  data: {
    showInitialAd: false,
  },
  showInitialAd: () => set({ data: { showInitialAd: true } }),
  hideInitialAd: () => set({ data: { showInitialAd: false } }),
  clearData: () => set({ data: { showInitialAd: false } }),
}));
