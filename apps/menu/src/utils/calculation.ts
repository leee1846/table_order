import type { ICategoryWithMenus, IMenu } from '@repo/api/types';
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
 * 장바구니 부가세 (POS 단말과 동일한 방식).
 * 카트 한 줄(ICartMenu)마다 과세 표준액(면세 메뉴 제외·면세 옵션 제외)에 대해 floor(금액/11) 후 합산.
 * (전체 합산 후 한 번만 floor 하면 POS 품목별 역산과 1원 차이 날 수 있음)
 */
export const calculateCartMenusTaxAmount = (
  menus: ICartMenu[],
  categories: ICategoryWithMenus[] | null | undefined
): number => {
  const menuSeqToCategoryMenu = buildMenuSeqToCategoryMenuMap(categories);
  return menus.reduce((totalTax, menu) => {
    const categoryMenu = menuSeqToCategoryMenu.get(menu.menuSeq);
    if (categoryMenu?.isTaxFree === true) {
      return totalTax;
    }
    const taxableOptionsTotal = menu.selectedOptions.reduce(
      (optSum, opt) =>
        isOptionTaxFreeInCategoryMenu(
          categoryMenu,
          opt.optionGroupSeq,
          opt.optionSeq
        )
          ? optSum
          : optSum + opt.optionPrice * opt.quantity,
      0
    );
    const lineTaxable = (menu.menuPrice + taxableOptionsTotal) * menu.quantity;
    return totalTax + Math.floor(lineTaxable / 11);
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
}

/**
 * 메뉴와 옵션의 총 가격을 계산함
 *
 * @param menuPrice - 메뉴 기본 가격
 * @param menuQuantity - 메뉴 수량
 * @param options - 선택된 옵션 배열
 * @returns 계산된 총 가격
 *
 */
export const calculateMenuTotalPrice = (
  menuPrice: number,
  menuQuantity: number,
  options: MenuPriceOption[]
): number => {
  // 메뉴 가격 * 메뉴 수량
  const menuTotalPrice = menuPrice * menuQuantity;

  // 옵션 가격 * 옵션 수량
  const optionsTotalPrice = options.reduce((sum, option) => {
    const calculatedQuantity = menuQuantity * option.quantity;
    return sum + option.optionPrice * calculatedQuantity;
  }, 0);

  return menuTotalPrice + optionsTotalPrice;
};
