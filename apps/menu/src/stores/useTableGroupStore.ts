import { STORAGE_KEYS } from '@/constants/keys';
import { AppStorage } from '@repo/util/app';
import type { ITableGroup } from '@repo/api/types';
import { create } from '@repo/feature/zustand';
import { isEqualByJson } from '@repo/util/function';

export interface ITableGroupStore {
  data: ITableGroup[] | null;
  setData: (data: ITableGroup[]) => void;
  clearData: () => void;
}

/**
 * 테이블 그룹 데이터를 관리하는 Zustand 스토어
 *
 * @description
 * - 테이블 그룹 목록과 각 그룹의 테이블 정보를 저장하고 관리합니다
 * - 데이터를 AppStorage에 저장하여 새로고침 시에도 유지됩니다
 */
export const useTableGroupStore = create<ITableGroupStore>((set, get) => {
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
      if (isEqualByJson(get().data, data)) {
        return;
      }

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
