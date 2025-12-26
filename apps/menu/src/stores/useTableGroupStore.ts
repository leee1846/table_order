import { STORAGE_KEYS } from '@/constants/keys';
import { AppStorage } from '@repo/util/app';
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
export const useTableGroupStore = create<ITableGroupStore>((set) => {
  // 초기 데이터 로드 (비동기)
  AppStorage.loadData<ITableGroup[]>({ key: STORAGE_KEYS.TABLE_GROUP }).then(
    (data) => {
      if (data?.value) {
        set({ data: data.value });
      }
    }
  );

  return {
    data: null,
    setData: (data: ITableGroup[]) => {
      AppStorage.saveData({
        key: STORAGE_KEYS.TABLE_GROUP,
        value: data,
        isTemporary: true,
      });
      set({ data });
    },
    clearData: () => {
      AppStorage.removeData({
        key: STORAGE_KEYS.TABLE_GROUP,
      });
      set({ data: null });
    },
  };
});
