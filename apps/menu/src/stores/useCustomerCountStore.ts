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
 * 고객 객수 정보를 관리하는 Zustand 스토어
 *
 * @description
 * - 성인과 어린이 객수를 저장하고 관리합니다
 * - 데이터를 AppStorage에 저장하여 새로고침 시에도 유지됩니다
 */
export const useCustomerCountStore = create<ICustomerCountStore>((set) => {
  // 초기 데이터 로드 (비동기)
  AppStorage.loadData<{ adultCount: number; childCount: number }>({
    key: STORAGE_KEYS.CUSTOMER_COUNT,
  }).then((data) => {
    if (data?.value) {
      set({ data: data.value });
    }
  });

  return {
    data: null,
    setData: ({ adultCount, childCount }) => {
      const resultData = {
        adultCount,
        childCount,
      };

      AppStorage.saveData({
        key: STORAGE_KEYS.CUSTOMER_COUNT,
        value: resultData,
        isTemporary: true,
      });
      set({ data: resultData });
    },
    clearData: () => {
      AppStorage.removeData({
        key: STORAGE_KEYS.CUSTOMER_COUNT,
      });
      set({ data: null });
    },
  };
});
