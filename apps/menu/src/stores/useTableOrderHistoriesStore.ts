import { STORAGE_KEYS } from '@/constants/keys';
import { AppStorage } from '@repo/util/app';
import type { ITableCurrentStatus } from '@repo/api/types';
import { create } from '@repo/feature/zustand';
export interface ITableOrderHistoriesData {
  sseUpdatedAt?: number | null;
  discountRate: number;
  totalAmount: number;
  orderDetailMenuList: ITableCurrentStatus[];
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
  clearData: () => void;
}

/**
 * 테이블 주문 내역 데이터를 관리하는 Zustand 스토어
 *
 * @description
 * - 현재 테이블의 주문 내역 정보를 저장하고 관리합니다
 * - 테이블이 점유되지 않은 경우 'isEmptyTable' 상태로 저장됩니다
 * - SSE 업데이트 시간을 추적하여 변경된 데이터만 조회할 수 있습니다
 * - 데이터를 AppStorage에 저장하여 새로고침 시에도 유지됩니다
 */
export const useTableOrderHistoriesStore = create<ITableOrderHistoriesStore>(
  (set, get) => {
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
      clearData: () => {
        AppStorage.removeData({
          key: STORAGE_KEYS.TABLE_ORDER_HISTORIES,
        });
        set({ data: null });
      },
    };
  }
);
