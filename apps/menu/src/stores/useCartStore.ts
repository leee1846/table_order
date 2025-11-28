import { create } from '@repo/feature/zustand';
import type { IMenuBase } from '@repo/api/types';
import { STORAGE_KEYS } from '@/constants/keys';
import storage from '@/utils/storage';

export interface ICartOptions {
  /** 첫 주문 필수 항목이 있는지 여부 */
  hasFirstOrderRequiredItems: boolean;
}

export interface ICart extends ICartOptions {
  menus: IMenuBase[];
}

export interface ICartStore {
  data: ICart;
  /** 스토리지에서 데이터 불러오기 */
  loadFromStorage: () => void;

  setCartOptions: (options: ICartOptions) => void;

  /** 장바구니에 아이템 추가 */
  addToCart: (item: IMenuBase) => void;
  /** 장바구니에 아이템 제거 */
  removeFromCart: (item: IMenuBase) => void;
  /** 장바구니 비우기 */
  clearCart: () => void;
}

const initialData: ICart = {
  menus: [],
  hasFirstOrderRequiredItems: false,
};

export const useCartStore = create<ICartStore>((set, get) => ({
  data: initialData,

  // 스토리지에서 데이터 불러오기
  loadFromStorage: () => {
    const storedData = storage.load<ICart>(STORAGE_KEYS.CART);
    if (storedData) {
      set({ data: storedData });
    }
  },

  setCartOptions: (options: ICartOptions) => {
    const newData = {
      ...get().data,
      ...options,
    };
    storage.save(STORAGE_KEYS.CART, newData);
    set({ data: newData });
  },

  // 장바구니에 아이템 추가
  addToCart: (item: IMenuBase) => {
    const newItems = {
      ...get().data,
      menus: [...get().data.menus, item],
    };
    storage.save(STORAGE_KEYS.CART, newItems);
    set({ data: newItems });
  },

  // 장바구니에서 아이템 제거
  removeFromCart: (item: IMenuBase) => {
    const newMenus = get().data.menus.filter((i) => i.menuSeq !== item.menuSeq);
    storage.save(STORAGE_KEYS.CART, newMenus);
    set({ data: { ...get().data, menus: newMenus } });
  },

  // 장바구니 비우기
  clearCart: () => {
    storage.save(STORAGE_KEYS.CART, initialData.menus);
    set({ data: initialData });
  },
}));
