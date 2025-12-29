import { create } from '@repo/feature/zustand';
import { AppStorage } from '@repo/util/app';
import { STORAGE_KEYS } from '@/constants/keys';
import type { IGetShopThemeMenu, IGetShopPageSetting } from '@repo/api/types';

interface IShopPageSettingStore {
  data: {
    pageSettingData: IGetShopPageSetting | null;
    ShopThemeData: IGetShopThemeMenu | null;
  };
  setPageSettingData: (pageSettingData: IGetShopPageSetting) => void;
  clearPageSettingData: () => void;
  setShopThemeData: (ShopThemeData: IGetShopThemeMenu) => void;
  clearShopThemeData: () => void;
}

export const useShopPageSettingStore = create<IShopPageSettingStore>(
  (set, get) => {
    // 초기 데이터 로드 (비동기)
    Promise.all([
      AppStorage.loadData<IGetShopPageSetting>({
        key: STORAGE_KEYS.SHOP_PAGE_SETTING,
      }),
      AppStorage.loadData<IGetShopThemeMenu>({
        key: STORAGE_KEYS.SHOP_THEME_MENU,
      }),
    ]).then(([pageSettingData, ShopThemeData]) => {
      set({
        data: {
          pageSettingData: pageSettingData?.value ?? null,
          ShopThemeData: ShopThemeData?.value ?? null,
        },
      });
    });

    return {
      data: {
        pageSettingData: null,
        ShopThemeData: null,
      },
      setPageSettingData: (pageSettingData: IGetShopPageSetting) => {
        AppStorage.saveData({
          key: STORAGE_KEYS.SHOP_PAGE_SETTING,
          value: pageSettingData,
          isTemporary: true,
        });
        set({ data: { ...get().data, pageSettingData } });
      },
      clearPageSettingData: () => {
        AppStorage.removeData({
          key: STORAGE_KEYS.SHOP_PAGE_SETTING,
        });
        set({ data: { ...get().data, pageSettingData: null } });
      },
      setShopThemeData: (ShopThemeData: IGetShopThemeMenu) => {
        AppStorage.saveData({
          key: STORAGE_KEYS.SHOP_THEME_MENU,
          value: ShopThemeData,
          isTemporary: true,
        });
        set({ data: { ...get().data, ShopThemeData } });
      },
      clearShopThemeData: () => {
        AppStorage.removeData({
          key: STORAGE_KEYS.SHOP_THEME_MENU,
        });
        set({ data: { ...get().data, ShopThemeData: null } });
      },
    };
  }
);
