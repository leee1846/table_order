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

  setCartOptions: (options: ICartOptions) => void;

  /** 옵션 목록이 동일한지 비교 */
  areOptionsEqual: (
    options1: ICartMenu['selectedOptions'],
    options2: ICartMenu['selectedOptions']
  ) => boolean;

  /** 장바구니에 아이템 추가 */
  addToCart: (item: ICartMenu) => void;
  /** 장바구니 아이템 수량 업데이트 */
  updateCartItemQuantity: (index: number, newQuantity: number) => void;
  /** 장바구니 아이템 전체 업데이트 (옵션과 수량 포함) */
  updateCartItem: (index: number, item: ICartMenu) => void;
  /** 장바구니에 아이템 제거 */
  removeFromCart: (index: number) => void;
  /** 장바구니 비우기 */
  clearCart: () => void;
}

const initialData: ICart = {
  menus: [],
  hasFirstOrderRequiredItems: false,
};

export const useCartStore = create<ICartStore>((set, get) => ({
  data: storage.load<ICart>(STORAGE_KEYS.CART) ?? initialData,

  setCartOptions: (options: ICartOptions) => {
    const newData = {
      ...get().data,
      ...options,
    };
    storage.save(STORAGE_KEYS.CART, newData);
    set({ data: newData });
  },

  areOptionsEqual: (
    options1: ICartMenu['selectedOptions'],
    options2: ICartMenu['selectedOptions']
  ): boolean => {
    if (options1.length !== options2.length) {
      return false;
    }

    // 옵션을 정렬하여 비교 (optionSeq 기준)
    const sorted1 = [...options1].sort((a, b) => a.optionSeq - b.optionSeq);
    const sorted2 = [...options2].sort((a, b) => a.optionSeq - b.optionSeq);

    return sorted1.every((opt1, index) => {
      const opt2 = sorted2[index];
      return (
        opt2 !== undefined &&
        opt1.optionSeq === opt2.optionSeq &&
        opt1.quantity === opt2.quantity
      );
    });
  },

  // 장바구니에 아이템 추가
  addToCart: (item: ICartMenu) => {
    const currentMenus = get().data.menus;

    // 동일한 menuSeq와 동일한 옵션 목록을 가진 항목 찾기
    const existingItemIndex = currentMenus.findIndex(
      (menu) =>
        menu.menuSeq === item.menuSeq &&
        get().areOptionsEqual(menu.selectedOptions, item.selectedOptions)
    );

    let newMenus: ICartMenu[];

    if (existingItemIndex !== -1) {
      // 동일한 메뉴가 있는 경우: 수량만 증가
      newMenus = currentMenus.map((menu, index) =>
        index === existingItemIndex
          ? { ...menu, quantity: menu.quantity + item.quantity }
          : menu
      );
    } else {
      // 동일한 메뉴가 없는 경우: 새로운 항목 추가
      newMenus = [...currentMenus, item];
    }

    const newItems = {
      ...get().data,
      menus: newMenus,
    };
    storage.save(STORAGE_KEYS.CART, newItems);
    set({ data: newItems });
  },

  // 장바구니 아이템 수량 업데이트
  updateCartItemQuantity: (index: number, newQuantity: number) => {
    const menus = get().data.menus;
    if (index < 0 || index >= menus.length) {
      return;
    }
    const newMenus = menus.map((item, i) =>
      i === index ? { ...item, quantity: newQuantity } : item
    );
    const newData = {
      ...get().data,
      menus: newMenus,
    };
    storage.save(STORAGE_KEYS.CART, newData);
    set({ data: newData });
  },

  // 장바구니 아이템 전체 업데이트 (옵션과 수량 포함)
  updateCartItem: (index: number, item: ICartMenu) => {
    const menus = get().data.menus;
    if (index < 0 || index >= menus.length) {
      return;
    }
    const newMenus = menus.map((menu, i) => (i === index ? item : menu));
    const newData = {
      ...get().data,
      menus: newMenus,
    };
    storage.save(STORAGE_KEYS.CART, newData);
    set({ data: newData });
  },

  // 장바구니에서 아이템 제거
  removeFromCart: (index: number) => {
    const menus = get().data.menus;
    if (index < 0 || index >= menus.length) {
      return;
    }

    // 해당 인덱스의 메뉴만 삭제
    const newMenus = menus.filter((_, i) => i !== index);

    const newData = {
      ...get().data,
      menus: newMenus,
    };
    storage.save(STORAGE_KEYS.CART, newData);
    set({ data: newData });
  },

  // 장바구니 비우기
  clearCart: () => {
    storage.save(STORAGE_KEYS.CART, { ...initialData, menus: [] });
    set({ data: { ...initialData, menus: [] } });
  },
}));
