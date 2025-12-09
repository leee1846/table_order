import type { IGetShopItem } from '@repo/api/types';
import { create } from '@repo/feature/zustand';
import storage from '@/utils/storage';
import { STORAGE_KEYS } from '@/constants/keys';

export interface IShopStore {
  data: IGetShopItem | null;
  setData: (data: IGetShopItem) => void;
  /** 데이터 초기화 (스토리지에서도 삭제) */
  clearData: () => void;
}

export const useShopStore = create<IShopStore>((set) => ({
  data: storage.load<IGetShopItem>(STORAGE_KEYS.SHOP) ?? null,
  setData: (data: IGetShopItem) => {
    storage.save(STORAGE_KEYS.SHOP, data);
    set({ data });
  },
  clearData: () => {
    storage.remove(STORAGE_KEYS.SHOP);
    set({ data: null });
  },
}));
