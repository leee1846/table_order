import { storage } from '@repo/util/function';
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
export const useCustomerCountStore = create<ICustomerCountStore>((set) => ({
  data:
    storage.session.load<{
      adultCount: number;
      childCount: number;
    }>(STORAGE_KEYS.CUSTOMER_COUNT) ?? null,

  setData: ({ adultCount, childCount }) => {
    const resultData = {
      adultCount,
      childCount,
    };

    storage.session.save(STORAGE_KEYS.CUSTOMER_COUNT, resultData);
    set({ data: resultData });
  },

  clearData: () => {
    storage.session.remove(STORAGE_KEYS.CUSTOMER_COUNT);
    set({ data: null });
  },
}));
