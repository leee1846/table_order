import { create } from '@repo/feature/zustand';
import type { IGetShop } from '@repo/api/types';
import { STORAGE_KEYS } from '@/constants/keys';
import { storage } from '@repo/util/function';

interface IShopDetailStore {
  data: IGetShop | null;
  setData: (data: IGetShop) => void;
  clearData: () => void;
}

/**
 * 상점 상세 데이터를 관리하는 스토어
 * - API 응답을 받아 스토리지에 저장
 */
export const useShopDetailStore = create<IShopDetailStore>((set) => ({
  data: storage.session.load<IGetShop>(STORAGE_KEYS.SHOP_DETAIL) ?? null,
  setData: (data: IGetShop) => {
    storage.session.save(STORAGE_KEYS.SHOP_DETAIL, data);
    set({ data });
  },
  clearData: () => {
    storage.session.remove(STORAGE_KEYS.SHOP_DETAIL);
    set({ data: null });
  },
}));
