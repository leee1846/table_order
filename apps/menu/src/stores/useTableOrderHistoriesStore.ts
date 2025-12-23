import { STORAGE_KEYS } from '@/constants/keys';
import { AppStorage } from '@repo/util/app';
import type { IOrderHistory } from '@repo/api/types';
import { create } from '@repo/feature/zustand';

export interface ITableOrderHistoriesData {
  sseUpdatedAt?: number | null;
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
  (set) => {
    // 초기 데이터 로드 (비동기)
    AppStorage.loadData<ITableOrderHistoriesData>(
      STORAGE_KEYS.TABLE_ORDER_HISTORIES
    ).then((data) => {
      if (data) {
        set({ data });
      }
    });

    return {
      data: null,
      setDataAsync: (data: ITableOrderHistoriesData) => {
        return new Promise((resolve) => {
          AppStorage.saveData(STORAGE_KEYS.TABLE_ORDER_HISTORIES, data);
          set({ data });
          resolve(true);
        });
      },
      clearData: () => {
        AppStorage.removeData(STORAGE_KEYS.TABLE_ORDER_HISTORIES);
        set({ data: null });
      },
    };
  }
);
