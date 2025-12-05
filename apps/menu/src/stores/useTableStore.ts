import { STORAGE_KEYS } from '@/constants/keys';
import { create } from '@repo/feature/zustand';
import storage from '@/utils/storage';

export interface ITable {
  tableNumber: number;
}

interface ITableStore {
  table: ITable | null;
  setTableAsync: (table: ITable) => void;
  clearTable: () => void;
}

export const useTableStore = create<ITableStore>((set) => ({
  table: storage.load<ITable>(STORAGE_KEYS.TABLE) ?? null,

  setTableAsync: (table: ITable) => {
    return new Promise((resolve) => {
      storage.save(STORAGE_KEYS.TABLE, table);
      set({ table });
      resolve(true);
    });
  },

  clearTable: () => {
    storage.remove(STORAGE_KEYS.TABLE);
    set({ table: null });
  },
}));
