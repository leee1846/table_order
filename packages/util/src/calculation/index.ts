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
  /**
   * true: 옵션 가격이 메뉴 수량과 무관하게 고정됨 (isMenuQuantityIndependent)
   * false/undefined: 옵션 가격에 메뉴 수량 곱셈 적용 (기본 동작)
   */
  isMenuQuantityIndependent?: boolean;
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
    // 메뉴 수량에 연동되는 옵션: (메뉴 가격 + 옵션 가격 합계) × 메뉴 수량
    const dependentOptionTotal = item.selectedOptions.reduce(
      (optSum, opt) =>
        opt.isMenuQuantityIndependent
          ? optSum
          : optSum + opt.optionPrice * opt.selectedQuantity,
      0
    );
    // 메뉴 수량과 무관한 옵션: 옵션 가격 합계 (메뉴 수량 곱셈 없음)
    const independentOptionTotal = item.selectedOptions.reduce(
      (optSum, opt) =>
        opt.isMenuQuantityIndependent
          ? optSum + opt.optionPrice * opt.selectedQuantity
          : optSum,
      0
    );
    return (
      sum +
      (item.menu.menuPrice + dependentOptionTotal) * item.quantity +
      independentOptionTotal
    );
  }, 0);
};
