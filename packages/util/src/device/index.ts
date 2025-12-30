/**
 * 기기 타입을 한글 라벨로 변환합니다.
 *
 * @param deviceType - 기기 타입 ('MENU' | 'ORDER_POS' | 'POS_APP')
 * @returns 한글 라벨
 *
 * @example
 * ```ts
 * getDeviceTypeLabel('MENU') // "메뉴판"
 * getDeviceTypeLabel('ORDER_POS') // "오더포스"
 * getDeviceTypeLabel('POS_APP') // "포스앱"
 * ```
 */
export const getDeviceTypeLabel = (
  deviceType: 'MENU' | 'ORDER_POS' | 'POS_APP'
): string => {
  switch (deviceType) {
    case 'MENU':
      return '메뉴판';
    case 'ORDER_POS':
      return '오더포스';
    case 'POS_APP':
      return '포스앱';
    default:
      return deviceType;
  }
};

