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
 * 상점 데이터를 관리하는 스토어
 * - API 응답을 받아 스토리지에 저장
 */
export const useShopStore = create<IShopStore>((set) => {
  // 초기 데이터 로드 (비동기)
  AppStorage.loadData<IGetShopItem>(STORAGE_KEYS.SHOP).then((data) => {
    if (data) {
      set({ data });
    }
  });

  return {
    data: null,
    setData: (data: IGetShopItem) => {
      AppStorage.saveData(STORAGE_KEYS.SHOP, data);
      set({ data });
    },
    clearData: () => {
      AppStorage.removeData(STORAGE_KEYS.SHOP);
      set({ data: null });
    },
  };
});
