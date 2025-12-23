import { create } from '@repo/feature/zustand';
import type { IGetShop } from '@repo/api/types';
import { STORAGE_KEYS } from '@/constants/keys';
import { AppStorage } from '@repo/util/app';

interface IShopDetailStore {
  data: IGetShop | null;
  setData: (data: IGetShop) => void;
  clearData: () => void;
}

/**
 * 상점 상세 데이터를 관리하는 스토어
 * - API 응답을 받아 스토리지에 저장
 */
export const useShopDetailStore = create<IShopDetailStore>((set) => {
  // 초기 데이터 로드 (비동기)
  AppStorage.loadData<IGetShop>(STORAGE_KEYS.SHOP_DETAIL).then((data) => {
    if (data) {
      set({ data });
    }
  });

  return {
    data: null,
    setData: (data: IGetShop) => {
      AppStorage.saveData(STORAGE_KEYS.SHOP_DETAIL, data);
      set({ data });
    },
    clearData: () => {
      AppStorage.removeData(STORAGE_KEYS.SHOP_DETAIL);
      set({ data: null });
    },
  };
});
