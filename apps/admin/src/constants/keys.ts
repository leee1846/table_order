export const STORAGE_KEYS = {
  /** 관리자 웹에서 선택한 매장 코드 키 */
  SHOP_CODE: 'shop-code',
  /** 관리자 웹에서 선택한 매장 시퀀스 키 */
  SHOP_SEQ: 'shop-seq',
} as const;

export const SSE_KEYS = {
  /** SSE 연결 키 */
  MAIN_CONNECTION: 'sse-main-connection',
} as const;

/** 관리자 언어 저장 키 */
export const ADMIN_LANGUAGE_STORAGE_KEY = 'adminLanguage';

/** 테이블 그룹 선택 키 */
export const TABLE_GROUP_STORAGE_KEY = 'selectedTableGroupSeq';

/** 매출 모달, 주문 모달의 표 행 사이즈 */
export const PAZE_SIZE = 6;

/** 기기 모달의 표 행 사이즈 */ 
export const DEVICE_LIST_PAGE_SIZE = 8;

/** settings/sales 페이지들의 표 행 사이즈 */
export const SALES_PAGE_SIZE = 7;
