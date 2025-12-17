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
  // isMenuQuantityDependant가 false인 경우, 메뉴 수량을 곱해서 계산
  const optionsTotalPrice = options.reduce((sum, option) => {
    const calculatedQuantity = menuQuantity * option.quantity;
    return sum + option.optionPrice * calculatedQuantity;
  }, 0);

  return menuTotalPrice + optionsTotalPrice;
};
