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
   * api요청 후, 주문내역이 없을경우 'isEmptyTable'
   * api요청 후, 주문내역이 있을경우 ITableOrderHistoriesData
   * */
  data: ITableOrderHistoriesData | null | 'isEmptyTable';
  setDataAsync: (data: ITableOrderHistoriesData | 'isEmptyTable') => void;
}

/**
 * 테이블 주문 내역 데이터를 관리하는 스토어
 * - API 응답을 받아 스토리지에 저장
 */
export const useTableOrderHistoriesStore = create<ITableOrderHistoriesStore>(
  (set) => {
    // 초기 데이터 로드 (비동기)
    AppStorage.loadData<ITableOrderHistoriesData>({
      key: STORAGE_KEYS.TABLE_ORDER_HISTORIES,
    }).then((data) => {
      if (data?.value) {
        set({ data: data.value });
      }
    });

    return {
      data: null,
      setDataAsync: (data) => {
        return new Promise((resolve) => {
          AppStorage.saveData({
            key: STORAGE_KEYS.TABLE_ORDER_HISTORIES,
            value: data,
            isTemporary: true,
          });
          set({ data });
          resolve(true);
        });
      },
    };
  }
);
