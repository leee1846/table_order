import { STORAGE_KEYS } from '@/constants/keys';
import storage from '@/utils/storage';
import type { IOrderHistory } from '@repo/api/types';
import { create } from '@repo/feature/zustand';

export interface ITableOrderHistoriesStore {
  /**
   * 테이블 주문 내역 데이터
   * api요청 전, 초기값 null
   * api요청 후, 데이터가 없을경우 empty array
   * empty array일 경우, api새로 요청하지 않음.
   * */
  data: IOrderHistory[] | null;
  setData: (data: IOrderHistory[]) => void;
  clearData: () => void;
}

export const useTableOrderHistoriesStore = create<ITableOrderHistoriesStore>(
  (set) => ({
    data:
      storage.load<IOrderHistory[]>(STORAGE_KEYS.TABLE_ORDER_HISTORIES) ?? null,
    setData: (data: IOrderHistory[]) => {
      storage.save(STORAGE_KEYS.TABLE_ORDER_HISTORIES, data);
      set({ data });
    },
    clearData: () => {
      storage.remove(STORAGE_KEYS.TABLE_ORDER_HISTORIES);
      set({ data: null });
    },
  })
);
