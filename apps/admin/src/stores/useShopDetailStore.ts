import { create } from '@repo/feature/zustand';
import type { IGetShop } from '@repo/api/types';

interface IShopDetailStore {
  data: IGetShop | null;
  setData: (data: IGetShop) => void;
  clearData: () => void;
}

/**
 * 상점 상세 데이터를 관리하는 스토어
 * - API 응답을 받아 메모리에만 저장 (스토리지 저장 불필요)
 */
export const useShopDetailStore = create<IShopDetailStore>((set) => ({
  data: null,
  setData: (data: IGetShop) => {
    set({ data });
  },
  clearData: () => {
    set({ data: null });
  },
}));
