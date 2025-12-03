/**
 * 메뉴 가격 계산에 사용되는 옵션 정보
 */
export interface MenuPriceOption {
  /** 옵션 가격 */
  optionPrice: number;
  /** 옵션 수량 */
  quantity: number;
  /** 메뉴 수량에 의존하는지 여부 (true: 수량과 무관, false: 수량에 곱해짐) */
  isMenuQuantityDependant: boolean;
}

/**
 * 메뉴와 옵션의 총 가격을 계산합니다.
 *
 * 계산 로직:
 * - isMenuQuantityDependant이 true인 옵션: 수량과 무관하게 가격 합산
 * - isMenuQuantityDependant이 false인 옵션: 메뉴 수량에 곱해짐
 * - 최종: (메뉴 가격 + 수량에 곱해지는 옵션 가격) * 메뉴 수량 + 수량과 무관한 옵션 가격
 *
 * @param menuPrice - 메뉴 기본 가격
 * @param menuQuantity - 메뉴 수량
 * @param options - 선택된 옵션 배열
 * @returns 계산된 총 가격
 *
 * @example
 * ```ts
 * calculateMenuTotalPrice(
 *   10000, // 메뉴 가격
 *   2,     // 메뉴 수량
 *   [
 *     { optionPrice: 1000, quantity: 1, isMenuQuantityDependant: false }, // 수량에 곱해짐
 *     { optionPrice: 500, quantity: 1, isMenuQuantityDependant: true },   // 수량과 무관
 *   ]
 * );
 * // (10000 + 1000) * 2 + 500 = 22500
 * ```
 */
export const calculateMenuTotalPrice = (
  menuPrice: number,
  menuQuantity: number,
  options: MenuPriceOption[]
): number => {
  let dependentOptionsPrice = 0; // 수량에 곱해지는 옵션 가격
  let independentOptionsPrice = 0; // 수량과 무관한 옵션 가격

  options.forEach((option) => {
    // 옵션 가격 * 수량
    const optionTotalPrice = option.optionPrice * option.quantity;

    if (option.isMenuQuantityDependant) {
      // 수량과 무관: 옵션 가격은 그대로
      independentOptionsPrice += optionTotalPrice;
    } else {
      // 수량에 곱해짐: 옵션 가격도 수량에 곱함
      dependentOptionsPrice += optionTotalPrice;
    }
  });

  // 메뉴 가격 + 수량에 곱해지는 옵션 가격을 수량에 곱하고, 수량과 무관한 옵션 가격을 더함
  return (
    (menuPrice + dependentOptionsPrice) * menuQuantity + independentOptionsPrice
  );
};
