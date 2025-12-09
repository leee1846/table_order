import { create } from '@repo/feature/zustand';
import type { IGetShop } from '@repo/api/types';
import { STORAGE_KEYS } from '@/constants/keys';
import storage from '@/utils/storage';

interface IShopDetailStore {
  data: IGetShop | null;
  setData: (data: IGetShop) => void;
  clearData: () => void;
}

export const useShopDetailStore = create<IShopDetailStore>((set) => ({
  data: storage.load<IGetShop>(STORAGE_KEYS.SHOP_DETAIL) ?? null,
  setData: (data: IGetShop) => {
    storage.save(STORAGE_KEYS.SHOP_DETAIL, data);
    set({ data });
  },
  clearData: () => {
    storage.remove(STORAGE_KEYS.SHOP_DETAIL);
    set({ data: null });
  },
}));
