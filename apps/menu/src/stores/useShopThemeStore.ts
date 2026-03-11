import { create } from '@repo/feature/zustand';
import { AppStorage } from '@repo/util/app';
import { STORAGE_KEYS } from '@/constants/keys';
import type { IGetShopThemeMenu, IGetShopThemePage } from '@repo/api/types';
import { isEqualByJson } from '@repo/util/function';

interface IShopThemeStore {
  data: {
    themePageData: IGetShopThemePage | null;
    shopThemeData: IGetShopThemeMenu | null;
  };
  setThemePageData: (themePageData: IGetShopThemePage) => void;
  clearThemePageData: () => void;
  setShopThemeData: (shopThemeData: IGetShopThemeMenu) => void;
  clearShopThemeData: () => void;
}

/**
 * 매장 테마 정보를 관리하는 Zustand 스토어
 *
 * @description
 * - 매장 테마 페이지 데이터와 메뉴 테마 데이터를 저장하고 관리합니다
 * - 다크 모드 설정, 로고 이미지 등 테마 관련 정보를 관리합니다
 * - 데이터를 AppStorage에 저장하여 새로고침 시에도 유지됩니다
 */
export const useShopThemeStore = create<IShopThemeStore>((set, get) => {
  // 초기 데이터 로드 (비동기)
  Promise.all([
    AppStorage.loadData<IGetShopThemePage>({
      key: STORAGE_KEYS.SHOP_THEME_PAGE,
    }),
    AppStorage.loadData<IGetShopThemeMenu>({
      key: STORAGE_KEYS.SHOP_THEME_MENU,
    }),
  ]).then(([themePageData, shopThemeData]) => {
    set({
      data: {
        themePageData: themePageData?.value ?? null,
        shopThemeData: shopThemeData?.value ?? null,
      },
    });
  });

  return {
    data: {
      themePageData: null,
      shopThemeData: null,
    },
    setThemePageData: (themePageData: IGetShopThemePage) => {
      if (isEqualByJson(get().data.themePageData, themePageData)) {
        return;
      }

      AppStorage.saveData({
        key: STORAGE_KEYS.SHOP_THEME_PAGE,
        value: themePageData,
        isTemporary: true,
      });
      set({ data: { ...get().data, themePageData } });
    },
    clearThemePageData: () => {
      AppStorage.removeData({
        key: STORAGE_KEYS.SHOP_THEME_PAGE,
      });
      set({ data: { ...get().data, themePageData: null } });
    },
    setShopThemeData: (shopThemeData: IGetShopThemeMenu) => {
      if (isEqualByJson(get().data.shopThemeData, shopThemeData)) {
        return;
      }

      AppStorage.saveData({
        key: STORAGE_KEYS.SHOP_THEME_MENU,
        value: shopThemeData,
        isTemporary: true,
      });
      set({ data: { ...get().data, shopThemeData } });
    },
    clearShopThemeData: () => {
      AppStorage.removeData({
        key: STORAGE_KEYS.SHOP_THEME_MENU,
      });
      set({ data: { ...get().data, shopThemeData: null } });
    },
  };
});
