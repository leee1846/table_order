import { create } from '@repo/feature/zustand';

interface IStandbyAdStore {
  data: {
    /** 전면 대기 광고 노출 여부 */
    isStandbyAdVisible: boolean;
  };
  /** 전면 광고를 다시 보이게 함 */
  openStandbyAd: () => void;
  /** 전면 광고를 닫음 */
  hideStandbyAd: () => void;
  clearData: () => void;
}

/**
 * 전면 대기 광고 노출 여부를 관리
 */
export const useStandbyAdStore = create<IStandbyAdStore>((set) => ({
  data: {
    isStandbyAdVisible: true,
  },
  openStandbyAd: () => set({ data: { isStandbyAdVisible: true } }),
  hideStandbyAd: () => set({ data: { isStandbyAdVisible: false } }),
  clearData: () => set({ data: { isStandbyAdVisible: false } }),
}));
