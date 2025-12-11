import { STORAGE_KEYS } from '@/constants/keys';
import { storage } from '@repo/util/function';
import type { IOrderHistory } from '@repo/api/types';
import { create } from '@repo/feature/zustand';

export interface ITableOrderHistoriesData {
  discountRate: number;
  totalAmount: number;
  orderDetailMenuList: IOrderHistory[];
}

export interface ITableOrderHistoriesStore {
  /**
   * 테이블 주문 내역 데이터
   * api요청 전, 초기값 null
   * api요청 후, 데이터가 없을경우 empty array
   * empty array일 경우, api새로 요청하지 않음.
   * */
  data: ITableOrderHistoriesData | null;
  setDataAsync: (data: ITableOrderHistoriesData) => void;
  clearData: () => void;
}

/**
 * 테이블 주문 내역 데이터를 관리하는 스토어
 * - API 응답을 받아 스토리지에 저장
 */
export const useTableOrderHistoriesStore = create<ITableOrderHistoriesStore>(
  (set) => ({
    data:
      storage.session.load<ITableOrderHistoriesData>(
        STORAGE_KEYS.TABLE_ORDER_HISTORIES
      ) ?? null,
    setDataAsync: (data: ITableOrderHistoriesData) => {
      return new Promise((resolve) => {
        storage.session.save(STORAGE_KEYS.TABLE_ORDER_HISTORIES, data);
        set({ data });
        resolve(true);
      });
    },
    clearData: () => {
      storage.session.remove(STORAGE_KEYS.TABLE_ORDER_HISTORIES);
      set({ data: null });
    },
  })
);
