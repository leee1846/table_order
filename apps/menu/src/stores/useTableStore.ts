import { STORAGE_KEYS } from '@/constants/keys';
import { create } from '@repo/feature/zustand';
import storage from '@/utils/storage';

export interface ITable {
  tableNumber: number;
}

interface ITableStore {
  data: ITable | null;
  setDataAsync: (data: ITable) => void;
  clearData: () => void;
}

/**
 * 선택한 테이블 데이터를 관리하는 스토어
 * - API 응답을 받아 스토리지에 저장
 */
export const useTableStore = create<ITableStore>((set) => ({
  data: {
    tableNumber: 0,
  },
  // data: storage.load<ITable>(STORAGE_KEYS.TABLE) ?? null,

  setDataAsync: (data: ITable) => {
    return new Promise((resolve) => {
      storage.save(STORAGE_KEYS.TABLE, data);
      set({ data });
      resolve(true);
    });
  },

  clearData: () => {
    storage.remove(STORAGE_KEYS.TABLE);
    set({ data: null });
  },
}));
