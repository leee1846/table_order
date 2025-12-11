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

/**
 * 상점 데이터를 관리하는 스토어
 * - API 응답을 받아 스토리지에 저장
 */
export const useShopStore = create<IShopStore>((set) => ({
  data: storage.session.load<IGetShopItem>(STORAGE_KEYS.SHOP) ?? null,
  setData: (data: IGetShopItem) => {
    storage.session.save(STORAGE_KEYS.SHOP, data);
    set({ data });
  },
  clearData: () => {
    storage.session.remove(STORAGE_KEYS.SHOP);
    set({ data: null });
  },
}));
