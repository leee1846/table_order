import storage from '@/utils/storage';
import { STORAGE_KEYS } from '@/constants/keys';
import { create } from '@repo/feature/zustand';

type CustomerCountMap = Record<
  string,
  {
    adultCount: number;
    childCount?: number;
  }
>;

export interface ICustomerCountStore {
  data: CustomerCountMap;
  setData: (
    tableNumber: string,
    payload: { adultCount: number; childCount: number }
  ) => void;
  clearData: (tableNumber?: string) => void;
}

/**
 * 객수 상태 저장 스토어 (테이블별)
 */
export const useCustomerCountStore = create<ICustomerCountStore>((set) => ({
  //현재 고객 수 데이터, 초기는 빈 객체
  data:
    storage.load<CustomerCountMap>(STORAGE_KEYS.CUSTOMER_COUNT) ??
    ({} as CustomerCountMap),

  //특정 테이블의 고객 수 설정
  setData: (tableNumber, { adultCount, childCount }) => {
    const currentData = { ...useCustomerCountStore.getState().data };
    delete currentData[tableNumber];

    const nextData: CustomerCountMap = {
      ...currentData,
      [tableNumber]: { adultCount, childCount },
    };

    storage.save(STORAGE_KEYS.CUSTOMER_COUNT, nextData);
    set({ data: nextData });
  },

  //특정 테이블의 고객 수 초기화
  clearData: (tableNumber) => {
    if (typeof tableNumber === 'number') {
      const cloned = { ...useCustomerCountStore.getState().data };
      delete cloned[tableNumber];
      storage.save(STORAGE_KEYS.CUSTOMER_COUNT, cloned);
      set({ data: cloned });
      return;
    }

    storage.remove(STORAGE_KEYS.CUSTOMER_COUNT);
    set({ data: {} as CustomerCountMap });
  },
}));
