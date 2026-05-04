import type { ICategoryWithMenus, IMenu, IOrder } from '@repo/api/types';
import type { ICartMenu } from '@/types/cart';

/**
 * 카테고리 API 메뉴 기준으로 menuSeq → 메뉴(면세·옵션 메타) 맵 (부가세 계산용)
 */
export const buildMenuSeqToCategoryMenuMap = (
  categories: ICategoryWithMenus[] | null | undefined
): Map<number, IMenu> => {
  const map = new Map<number, IMenu>();
  categories?.forEach((category) => {
    category.menuInfoList?.forEach((menu) => {
      map.set(menu.menuSeq, menu);
    });
  });
  return map;
};

/**
 * 카테고리에 등록된 옵션 메타의 면세 여부 (카트에는 저장하지 않고 계산 시에만 조회)
 */
export const isOptionTaxFreeInCategoryMenu = (
  categoryMenu: IMenu | undefined,
  optionGroupSeq: number,
  optionSeq: number
): boolean => {
  const option = categoryMenu?.optionGroupList
    ?.flatMap((g) => g.optionList ?? [])
    .find(
      (o) => o.optionGroupSeq === optionGroupSeq && o.optionSeq === optionSeq
    );
  return option?.isTaxFree === true;
};

/**
 * 카테고리 메뉴에서 옵션 그룹의 isMenuQuantityIndependent 여부 조회
 * true: 옵션 수량이 메뉴 수량과 무관하게 고정됨
 */
export const isOptionGroupIndependentInCategoryMenu = (
  categoryMenu: IMenu | undefined,
  optionGroupSeq: number
): boolean => {
  return (
    categoryMenu?.optionGroupList?.find(
      (g) => g.optionGroupSeq === optionGroupSeq
    )?.isMenuQuantityIndependent ?? false
  );
};

/**
 * 장바구니 부가세 (POS 단말과 동일한 방식).
 * 메뉴와 옵션 각각의 단가에 대해 floor(단가/11)을 먼저 구한 뒤 수량을 곱해 합산한다.
 * 메뉴와 옵션의 isTaxFree는 독립적으로 판단한다.
 *   - 메뉴 isTaxFree: true  → 메뉴 가격만 과세 표준에서 제외
 *   - 옵션 isTaxFree: false → 해당 옵션 가격은 과세 표준에 포함
 * (합산 후 한 번만 floor 하면 POS 품목별 역산과 1원 차이 날 수 있음)
 *
 * isMenuQuantityIndependent=true 옵션 그룹:
 *   - 옵션 세금이 메뉴 수량에 무관하게 1회만 합산됨 (메뉴 단가 세금과 분리)
 */
export const calculateCartMenusTaxAmount = (
  menus: ICartMenu[],
  categories: ICategoryWithMenus[] | null | undefined
): number => {
  const menuSeqToCategoryMenu = buildMenuSeqToCategoryMenuMap(categories);
  return menus.reduce((totalTax, menu) => {
    const categoryMenu = menuSeqToCategoryMenu.get(menu.menuSeq);

    // 메뉴 단가를 먼저 floor 후 수량 곱셈 (POS 품목 단위와 동일)
    const menuUnitTax =
      categoryMenu?.isTaxFree === true ? 0 : Math.floor(menu.menuPrice / 11);

    // 일반 옵션(메뉴 수량 연동): 단가 floor 후 옵션수량 곱셈 → 합산 후 메뉴수량 곱셈
    const dependentOptionsTax = menu.selectedOptions.reduce((optSum, opt) => {
      if (
        isOptionGroupIndependentInCategoryMenu(categoryMenu, opt.optionGroupSeq)
      ) {
        return optSum;
      }
      if (
        isOptionTaxFreeInCategoryMenu(
          categoryMenu,
          opt.optionGroupSeq,
          opt.optionSeq
        )
      ) {
        return optSum;
      }
      return optSum + Math.floor(opt.optionPrice / 11) * opt.quantity;
    }, 0);

    // 독립 옵션(메뉴 수량 무관): 메뉴 수량 곱셈 없이 1회 합산
    const independentOptionsTax = menu.selectedOptions.reduce((optSum, opt) => {
      if (
        !isOptionGroupIndependentInCategoryMenu(
          categoryMenu,
          opt.optionGroupSeq
        )
      ) {
        return optSum;
      }
      if (
        isOptionTaxFreeInCategoryMenu(
          categoryMenu,
          opt.optionGroupSeq,
          opt.optionSeq
        )
      ) {
        return optSum;
      }
      return optSum + Math.floor(opt.optionPrice / 11) * opt.quantity;
    }, 0);

    return (
      totalTax +
      (menuUnitTax + dependentOptionsTax) * menu.quantity +
      independentOptionsTax
    );
  }, 0);
};

/**
 * 메뉴 가격 계산에 사용되는 옵션 정보
 */
interface MenuPriceOption {
  /** 옵션 가격 */
  optionPrice: number;
  /** 옵션 수량 */
  quantity: number;
  /**
   * true: 메뉴 수량과 무관하게 옵션 수량 고정 (isMenuQuantityIndependent)
   * false/undefined: 옵션 가격에 메뉴 수량 곱셈 적용 (기본 동작)
   */
  isMenuQuantityIndependent?: boolean;
}

/**
 * 메뉴와 옵션의 총 가격을 계산함
 *
 * @param menuPrice - 메뉴 기본 가격
 * @param menuQuantity - 메뉴 수량
 * @param options - 선택된 옵션 배열
 * @returns 계산된 총 가격
 *
 * isMenuQuantityIndependent=true 옵션: 옵션가격 × 옵션수량 (메뉴 수량 무관)
 * isMenuQuantityIndependent=false/undefined 옵션: 옵션가격 × 옵션수량 × 메뉴수량
 */
export const calculateMenuTotalPrice = (
  menuPrice: number,
  menuQuantity: number,
  options: MenuPriceOption[]
): number => {
  const menuTotalPrice = menuPrice * menuQuantity;

  const optionsTotalPrice = options.reduce((sum, option) => {
    const effectiveQuantity = option.isMenuQuantityIndependent
      ? option.quantity
      : menuQuantity * option.quantity;
    return sum + option.optionPrice * effectiveQuantity;
  }, 0);

  return menuTotalPrice + optionsTotalPrice;
};

/**
 * 장바구니 메뉴 배열을 주문 API 형식으로 변환하면서 옵션 수량을 조정함
 *
 * - 일반 옵션(isMenuQuantityIndependent=false): quantity = 메뉴수량 × 옵션수량
 * - 독립 옵션(isMenuQuantityIndependent=true): quantity = 옵션수량 (메뉴 수량 곱셈 없음)
 *
 * convertCartMenusToOrders + adjustOrderOptionQuantities 패턴을 대체하는 단일 함수.
 * ICartMenu 정보를 유지한 채 변환하므로 isMenuQuantityIndependent 정보 소실 없음.
 */
export const convertCartMenusToAdjustedOrders = (
  cartMenus: ICartMenu[],
  categories: ICategoryWithMenus[] | null | undefined
): IOrder[] => {
  const menuSeqToCategoryMenu = buildMenuSeqToCategoryMenuMap(categories);
  return cartMenus.map((menu) => {
    const categoryMenu = menuSeqToCategoryMenu.get(menu.menuSeq);
    return {
      menuSeq: menu.menuSeq,
      menuName: menu.menuName,
      menuPrice: menu.menuPrice,
      quantity: menu.quantity,
      selectedOptions: menu.selectedOptions.map((opt) => {
        const isIndependent = isOptionGroupIndependentInCategoryMenu(
          categoryMenu,
          opt.optionGroupSeq
        );
        return {
          optionSeq: opt.optionSeq,
          optionGroupSeq: opt.optionGroupSeq,
          optionName: opt.optionName,
          optionPrice: opt.optionPrice,
          quantity: isIndependent ? opt.quantity : menu.quantity * opt.quantity,
        };
      }),
    };
  });
};
