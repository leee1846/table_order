export const STORAGE_KEYS = {
  /** 인증 정보 (토큰 페이로드) 키 */
  AUTH: 'auth',
  /** 선택한 상점 상세 data 키 */
  SHOP_DETAIL: 'shop-detail',
  /** 객수 data 키 */
  CUSTOMER_COUNT: 'customer-count',
  /** admin 다국어 코드 키 */
  ADMIN_I18N_LANGUAGE: 'adminI18Lng',
} as const;

export const SSE_KEYS = {
  /** SSE 연결 키 */
  MAIN_CONNECTION: 'sse-main-connection',
} as const;

/** 관리자 언어 저장 키 */
export const ADMIN_LANGUAGE_STORAGE_KEY = 'adminLanguage';
