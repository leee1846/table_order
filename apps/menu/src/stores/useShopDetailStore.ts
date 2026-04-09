import { create } from '@repo/feature/zustand';
import type { IGetShop } from '@repo/api/types';
import { STORAGE_KEYS } from '@/constants/keys';
import { AppStorage } from '@repo/util/app';

interface IShopDetailStore {
  data: IGetShop | null;
  setData: (data: IGetShop) => Promise<void>;
  clearData: () => void;
}

/**
 * 매장 상세 정보를 관리하는 Zustand 스토어
 *
 * @description
 * - 매장의 상세 정보(영업 시간, 설정 등)를 저장하고 관리합니다
 * - 데이터를 AppStorage에 저장하여 새로고침 시에도 유지됩니다
 */
export const useShopDetailStore = create<IShopDetailStore>((set) => {
  // 초기 데이터 로드 (비동기)
  AppStorage.loadData<IGetShop>({ key: STORAGE_KEYS.SHOP_DETAIL }).then(
    (data) => {
      if (data?.value) {
        set({ data: data.value });
      }
    }
  );

  return {
    data: null,
    setData: async (data: IGetShop) => {
      set({ data });
      await AppStorage.saveData({
        key: STORAGE_KEYS.SHOP_DETAIL,
        value: data,
        isTemporary: true,
      });
    },
    clearData: () => {
      AppStorage.removeData({
        key: STORAGE_KEYS.SHOP_DETAIL,
      });
      set({ data: null });
    },
  };
});
