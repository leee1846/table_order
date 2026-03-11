import { create } from '@repo/feature/zustand';
import { STORAGE_KEYS } from '@/constants/keys';
import { AppStorage } from '@repo/util/app';
import type { ICartMenu } from '@/types/cart';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { isEqualByJson } from '@repo/util/function';

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

/**
 * 장바구니 상태를 관리하는 Zustand 스토어
 *
 * @description
 * - 장바구니에 담긴 메뉴 목록과 옵션을 관리합니다
 * - 동일한 메뉴와 옵션 조합이면 수량을 증가시키고, 아니면 새 항목으로 추가합니다
 * - 첫 주문 필수 항목 존재 여부를 옵션으로 관리합니다
 * - 데이터를 AppStorage에 저장하여 새로고침 시에도 유지됩니다
 */
export const useCartStore = create<ICartStore>((set, get) => {
  // 초기 데이터 로드 (비동기)
  AppStorage.loadData<ICart>({ key: STORAGE_KEYS.CART }).then((data) => {
    if (data?.value) {
      set({ data: data.value });
    }
  });

  return {
    data: initialData,

    setCartOptions: (options: ICartOptions) => {
      if (
        isEqualByJson(
          get().data.hasFirstOrderRequiredItems,
          options.hasFirstOrderRequiredItems
        )
      ) {
        return;
      }

      const newData = {
        ...get().data,
        ...options,
      };

      AppStorage.saveData({
        key: STORAGE_KEYS.CART,
        value: newData,
        isTemporary: true,
      });
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

      if (isEqualByJson(get().data.menus, newMenus)) {
        return;
      }

      const newItems = {
        ...get().data,
        menus: newMenus,
      };
      AppStorage.saveData({
        key: STORAGE_KEYS.CART,
        value: newItems,
        isTemporary: true,
      });
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

      if (isEqualByJson(get().data.menus, newMenus)) {
        return;
      }

      const newData = {
        ...get().data,
        menus: newMenus,
      };
      AppStorage.saveData({
        key: STORAGE_KEYS.CART,
        value: newData,
        isTemporary: true,
      });
      set({ data: newData });
    },

    // 장바구니 아이템 전체 업데이트 (옵션과 수량 포함)
    updateCartItem: (index: number, item: ICartMenu) => {
      const menus = get().data.menus;
      if (index < 0 || index >= menus.length) {
        return;
      }

      const newMenus = menus.map((menu, i) => (i === index ? item : menu));
      if (isEqualByJson(get().data.menus, newMenus)) {
        return;
      }

      const newData = {
        ...get().data,
        menus: newMenus,
      };
      AppStorage.saveData({
        key: STORAGE_KEYS.CART,
        value: newData,
        isTemporary: true,
      });
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

      if (isEqualByJson(get().data.menus, newMenus)) {
        return;
      }

      const newData = {
        ...get().data,
        menus: newMenus,
      };
      AppStorage.saveData({
        key: STORAGE_KEYS.CART,
        value: newData,
        isTemporary: true,
      });
      set({ data: newData });
    },

    // 장바구니 비우기
    clearCart: () => {
      // 현재 visibleCategories를 확인하여 hasFirstOrderRequiredItems 계산
      const categoryStore = useCategoryStore.getState();
      const visibleCategories = categoryStore.data.visibleCategories;
      const hasFirstOrderRequiredItems = visibleCategories.some(
        (c) => c.isFirstOrderRequired
      );

      const clearedData = {
        menus: [],
        hasFirstOrderRequiredItems,
      };

      if (isEqualByJson(get().data, clearedData)) {
        return;
      }

      AppStorage.saveData({
        key: STORAGE_KEYS.CART,
        value: clearedData,
        isTemporary: true,
      });
      set({ data: clearedData });
    },
  };
});
