import { create } from '@repo/feature/zustand';
import { storage } from '@repo/util/function';
import { STORAGE_KEYS } from '@/constants/keys';
import type { IGetShopPageLogo, IGetShopPageSetting } from '@repo/api/types';

interface IShopPageSettingStore {
  data: {
    pageSettingData: IGetShopPageSetting | null;
    pageLogoData: IGetShopPageLogo | null;
  };
  setPageSettingData: (pageSettingData: IGetShopPageSetting) => void;
  clearPageSettingData: () => void;
  setPageLogoData: (pageLogoData: IGetShopPageLogo) => void;
  clearPageLogoData: () => void;
}

export const useShopPageSettingStore = create<IShopPageSettingStore>(
  (set, get) => ({
    data: {
      pageSettingData:
        storage.session.load<IGetShopPageSetting>(
          STORAGE_KEYS.SHOP_PAGE_SETTING
        ) ?? null,
      pageLogoData:
        storage.session.load<IGetShopPageLogo>(STORAGE_KEYS.SHOP_PAGE_LOGO) ??
        null,
    },
    setPageSettingData: (pageSettingData: IGetShopPageSetting) => {
      storage.session.save(STORAGE_KEYS.SHOP_PAGE_SETTING, pageSettingData);
      set({ data: { ...get().data, pageSettingData } });
    },
    clearPageSettingData: () => {
      storage.session.remove(STORAGE_KEYS.SHOP_PAGE_SETTING);
      set({ data: { ...get().data, pageSettingData: null } });
    },
    setPageLogoData: (pageLogoData: IGetShopPageLogo) => {
      storage.session.save(STORAGE_KEYS.SHOP_PAGE_LOGO, pageLogoData);
      set({ data: { ...get().data, pageLogoData } });
    },
    clearPageLogoData: () => {
      storage.session.remove(STORAGE_KEYS.SHOP_PAGE_LOGO);
      set({ data: { ...get().data, pageLogoData: null } });
    },
  })
);
