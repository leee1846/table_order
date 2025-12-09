import { STORAGE_KEYS } from '@/constants/keys';
import storage from '@/utils/storage';
import type { ITableGroup } from '@repo/api/types';
import { create } from '@repo/feature/zustand';

export interface ITableGroupStore {
  data: ITableGroup[] | null;
  setData: (data: ITableGroup[]) => void;
  clearData: () => void;
}

/**
 * 테이블 그룹 데이터를 관리하는 스토어
 * - API 응답을 받아 스토리지에 저장
 */
export const useTableGroupStore = create<ITableGroupStore>((set) => ({
  data: storage.load<ITableGroup[]>(STORAGE_KEYS.TABLE_GROUP) ?? null,

  setData: (data: ITableGroup[]) => {
    storage.save(STORAGE_KEYS.TABLE_GROUP, data);
    set({ data });
  },

  clearData: () => {
    storage.remove(STORAGE_KEYS.TABLE_GROUP);
    set({ data: null });
  },
}));
