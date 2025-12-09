export const STORAGE_KEYS = {
  /** 선택한 다국어 코드 키 */
  I18N_LANGUAGE: 'i18Lng',
  /** 선택한 상점 data 키 */
  SHOP: 'shop',
  /** 카테고리 목록 data 키 */
  CATEGORIES: 'menu-categories',
  /** 장바구니 data 키 */
  CART: 'cart-menus',
  /** 테이블 주문 내역 data 키 */
  TABLE_ORDER_HISTORIES: 'table-order-histories',
  /** 선택한 테이블 data 키 */
  TABLE: 'table',
  /** 테이블 그룹 data 키 */
  TABLE_GROUP: 'table-group',
  /** 선택한 상점 상세 data 키 */
  SHOP_DETAIL: 'shop-detail',
  /** 객수 data 키 */
  CUSTOMER_COUNT: 'customer-count',
  /** 초기 화면 노출 여부 data 키 */
  INITIAL_PAGE_SHOW: 'initial-page-show',
} as const;

export const timerKeys = {
  /** 장바구니 알림 내부 타이머 키 */
  CART_REMINDER: 'cart-reminder',
  /** 카테고리 노출 여부 업데이트 타이머 키 */
  CATEGORY_VISIBILITY_UPDATE: 'category-visibility-update',
  /** 터치 감지 타이머 키 */
  TOUCH_DETECT_TIMEOUT: 'touch-detect-timeout',
  /** 직원 호출 비활성화 타이머 키 */
  DISABLE_STAFF_CALL: 'disable-staff-call',
  /** 터치 후 2분 타이머 키 */
  TOUCH_AFTER_TIMEOUT: 'touch-after-timeout',
};

export const DOM_IDS = {
  /** 카테고리 섹션 ID 접두사 */
  CATEGORY_SECTION_PREFIX: 'category-',
  /** 카테고리 섹션 ID 생성 함수 */
  getCategorySectionId: (categorySeq: number) => `category-${categorySeq}`,
  /** Contents 스크롤 컨테이너 ID */
  CONTENTS_SCROLL_CONTAINER: 'contents-scroll-container',
} as const;
