/**
 * 메뉴 항목의 가격 정보를 나타내는 인터페이스
 */
interface MenuPriceItem {
  menuPrice: number;
}

/**
 * 선택된 옵션의 가격 정보를 나타내는 인터페이스
 */
interface SelectedOptionPrice {
  optionPrice: number;
  selectedQuantity: number;
}

/**
 * 총합 금액 계산에 사용되는 메뉴 항목 인터페이스
 */
interface MenuItemForCalculation {
  menu: MenuPriceItem;
  selectedOptions: SelectedOptionPrice[];
  quantity: number;
}

/**
 * 선택된 메뉴들의 총합 금액을 계산합니다.
 * 메뉴 가격과 옵션 가격을 모두 포함하여 계산합니다.
 *
 * @param selectedMenus - 계산할 메뉴 항목 배열
 * @returns 총합 금액 (number)
 *
 * @example
 * ```ts
 * const selectedMenus = [
 *   {
 *     menu: { menuPrice: 10000 },
 *     selectedOptions: [
 *       { optionPrice: 1000, selectedQuantity: 2 }
 *     ],
 *     quantity: 2
 *   }
 * ];
 * calculateTotalAmount(selectedMenus); // 24000 (10000 + 2000) * 2
 * ```
 */
export const calculateTotalAmount = <T extends MenuItemForCalculation>(
  selectedMenus: T[]
): number => {
  return selectedMenus.reduce((sum, item) => {
    const optionTotal = item.selectedOptions.reduce(
      (optSum, opt) => optSum + opt.optionPrice * opt.selectedQuantity,
      0
    );
    return sum + (item.menu.menuPrice + optionTotal) * item.quantity;
  }, 0);
};
