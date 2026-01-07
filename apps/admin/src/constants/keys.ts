export const STORAGE_KEYS = {
  /** 인증 정보 (토큰 페이로드) 키 */
  AUTH: 'auth',

  /** 관리자 웹에서 선택한 매장 코드 키 */
  SHOP_CODE: 'shop-code',
} as const;

export const SSE_KEYS = {
  /** SSE 연결 키 */
  MAIN_CONNECTION: 'sse-main-connection',
} as const;

/** 관리자 언어 저장 키 */
export const ADMIN_LANGUAGE_STORAGE_KEY = 'adminLanguage';
