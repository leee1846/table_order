/**
 * 이름 필드 최대 길이 제한
 * DB VARCHAR(50) 기준으로 40자로 제한
 */
export const MAX_NAME_LENGTH = 40;

/**
 * 설명 필드 최대 길이 제한
 * DB VARCHAR(500) 기준으로 400자로 제한
 */
export const MAX_DESCRIPTION_LENGTH = 300;

/**
 * 테이블 그룹 이름 최대 길이 제한 (20자)
 */
export const MAX_TABLE_GROUP_NAME_LENGTH = 20;

/**
 * 기기 타입을 i18n 키(한국어)로 변환합니다.
 *
 * @param deviceType - 기기 타입 ('MENU' | 'ORDER_POS' | 'POS_APP')
 * @returns 한국어 키 문자열 (번역 파일에서 같은 키를 사용)
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
