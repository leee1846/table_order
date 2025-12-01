import { create } from '@repo/feature/zustand';
import { STORAGE_KEYS } from '@/constants/keys';
import storage from '@/utils/storage';
import type { ICartMenu } from '@/types/cart';

export interface ICartOptions {
  /** 첫 주문 필수 항목이 있는지 여부 */
  hasFirstOrderRequiredItems: boolean;
}

export interface ICart extends ICartOptions {
  menus: ICartMenu[];
}

export interface ICartStore {
  data: ICart;
  /** 스토리지에서 데이터 불러오기 */
  loadFromStorage: () => void;

  setCartOptions: (options: ICartOptions) => void;

  /** 장바구니에 아이템 추가 */
  addToCart: (item: ICartMenu) => void;
  /** 장바구니 아이템 수량 업데이트 */
  updateCartItemQuantity: (menuSeq: number, newQuantity: number) => void;
  /** 장바구니에 아이템 제거 */
  removeFromCart: (menuSeq: number) => void;
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
  addToCart: (item: ICartMenu) => {
    const newItems = {
      ...get().data,
      menus: [...get().data.menus, item],
    };
    storage.save(STORAGE_KEYS.CART, newItems);
    set({ data: newItems });
  },

  // 장바구니 아이템 수량 업데이트
  updateCartItemQuantity: (menuSeq: number, newQuantity: number) => {
    const newMenus = get().data.menus.map((item) =>
      item.menuSeq === menuSeq ? { ...item, quantity: newQuantity } : item
    );
    const newData = {
      ...get().data,
      menus: newMenus,
    };
    storage.save(STORAGE_KEYS.CART, newData);
    set({ data: newData });
  },

  // 장바구니에서 아이템 제거
  removeFromCart: (menuSeq: number) => {
    const newMenus = get().data.menus.filter((i) => i.menuSeq !== menuSeq);
    const newData = {
      ...get().data,
      menus: newMenus,
    };
    storage.save(STORAGE_KEYS.CART, newData);
    set({ data: newData });
  },

  // 장바구니 비우기
  clearCart: () => {
    storage.save(STORAGE_KEYS.CART, initialData.menus);
    set({ data: initialData });
  },
}));
