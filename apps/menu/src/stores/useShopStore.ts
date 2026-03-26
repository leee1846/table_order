import type { IGetShopItem } from '@repo/api/types';
import { create } from '@repo/feature/zustand';
import { AppStorage } from '@repo/util/app';
import { STORAGE_KEYS } from '@/constants/keys';

export interface IShopStore {
  data: IGetShopItem | null;
  setData: (data: IGetShopItem) => void;
  /** 데이터 초기화 (스토리지에서도 삭제) */
  clearData: () => void;
}

/**
 * 매장 기본 정보를 관리하는 Zustand 스토어
 *
 * @description
 * - 매장의 기본 정보(매장 코드, 이름 등)를 저장하고 관리합니다
 * - 데이터를 AppStorage에 저장하여 새로고침 시에도 유지됩니다
 */
export const useShopStore = create<IShopStore>((set, get) => {
  // 초기 데이터 로드 (비동기)
  AppStorage.loadData<IGetShopItem>({ key: STORAGE_KEYS.SHOP }).then((data) => {
    if (data?.value) {
      set({ data: data.value });
    }
  });

  return {
    data: null,
    setData: (data: IGetShopItem) => {
      AppStorage.saveData({
        key: STORAGE_KEYS.SHOP,
        value: data,
        isTemporary: true,
      });
      set({ data });
    },
    clearData: () => {
      AppStorage.removeData({
        key: STORAGE_KEYS.SHOP,
      });
      set({ data: null });
    },
  };
});
