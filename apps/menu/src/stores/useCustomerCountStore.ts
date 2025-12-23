import { AppStorage } from '@repo/util/app';
import { STORAGE_KEYS } from '@/constants/keys';
import { create } from '@repo/feature/zustand';

export interface ICustomerCountStore {
  data: {
    adultCount: number;
    childCount: number;
  } | null;

  setData: ({
    adultCount,
    childCount,
  }: {
    adultCount: number;
    childCount: number;
  }) => void;

  clearData: () => void;
}

/**
 * 객수 상태 저장 스토어
 */
export const useCustomerCountStore = create<ICustomerCountStore>((set) => {
  // 초기 데이터 로드 (비동기)
  AppStorage.loadData<{ adultCount: number; childCount: number }>(
    STORAGE_KEYS.CUSTOMER_COUNT
  ).then((data) => {
    if (data) {
      set({ data });
    }
  });

  return {
    data: null,
    setData: ({ adultCount, childCount }) => {
      const resultData = {
        adultCount,
        childCount,
      };

      AppStorage.saveData(STORAGE_KEYS.CUSTOMER_COUNT, resultData);
      set({ data: resultData });
    },
    clearData: () => {
      AppStorage.removeData(STORAGE_KEYS.CUSTOMER_COUNT);
      set({ data: null });
    },
  };
});
