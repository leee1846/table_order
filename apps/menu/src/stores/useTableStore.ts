import { STORAGE_KEYS } from '@/constants/keys';
import { create } from '@repo/feature/zustand';
import storage from '@/utils/storage';

export interface ITable {
  tableNumber: number;
}

interface ITableStore {
  table: ITable | null;
  setTable: (table: ITable) => void;
  clearTable: () => void;
}

export const useTableStore = create<ITableStore>((set) => ({
  // TODO: 초기값 주석 제거 예정
  table: {
    tableNumber: 0,
  },
  // table: storage.load<ITable>(STORAGE_KEYS.TABLE) ?? null,

  setTable: (table: ITable) => {
    storage.save(STORAGE_KEYS.TABLE, table);
    set({ table });
  },

  clearTable: () => {
    storage.remove(STORAGE_KEYS.TABLE);
    set({ table: null });
  },
}));
