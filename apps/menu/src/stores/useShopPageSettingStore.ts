import { create } from '@repo/feature/zustand';
import { AppStorage } from '@repo/util/app';
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
  (set, get) => {
    // 초기 데이터 로드 (비동기)
    Promise.all([
      AppStorage.loadData<IGetShopPageSetting>({
        key: STORAGE_KEYS.SHOP_PAGE_SETTING,
      }),
      AppStorage.loadData<IGetShopPageLogo>({
        key: STORAGE_KEYS.SHOP_PAGE_LOGO,
      }),
    ]).then(([pageSettingData, pageLogoData]) => {
      set({
        data: {
          pageSettingData: pageSettingData?.value ?? null,
          pageLogoData: pageLogoData?.value ?? null,
        },
      });
    });

    return {
      data: {
        pageSettingData: null,
        pageLogoData: null,
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
      setPageLogoData: (pageLogoData: IGetShopPageLogo) => {
        AppStorage.saveData({
          key: STORAGE_KEYS.SHOP_PAGE_LOGO,
          value: pageLogoData,
          isTemporary: true,
        });
        set({ data: { ...get().data, pageLogoData } });
      },
      clearPageLogoData: () => {
        AppStorage.removeData({
          key: STORAGE_KEYS.SHOP_PAGE_LOGO,
        });
        set({ data: { ...get().data, pageLogoData: null } });
      },
    };
  }
);
