import { create } from '@repo/feature/zustand';
import { storage } from '@repo/util/function';
import { STORAGE_KEYS } from '@/constants/keys';
import type { IGetShopPageSetting } from '@repo/api/types';

interface IShopPageSettingStore {
  data: {
    pageSettingData: IGetShopPageSetting | null;
  };
  setPageSettingData: (pageSettingData: IGetShopPageSetting) => void;
  clearPageSettingData: () => void;
}

export const useShopPageSettingStore = create<IShopPageSettingStore>(
  (set, get) => ({
    data: {
      pageSettingData:
        storage.session.load<IGetShopPageSetting>(
          STORAGE_KEYS.SHOP_PAGE_SETTING
        ) ?? null,
    },
    setPageSettingData: (pageSettingData: IGetShopPageSetting) => {
      storage.session.save(STORAGE_KEYS.SHOP_PAGE_SETTING, pageSettingData);
      set({ data: { ...get().data, pageSettingData } });
    },
    clearPageSettingData: () => {
      storage.session.remove(STORAGE_KEYS.SHOP_PAGE_SETTING);
      set({ data: { ...get().data, pageSettingData: null } });
    },
  })
);
