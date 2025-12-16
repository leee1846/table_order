export const STORAGE_KEYS = {
  /** 선택한 다국어 코드 키 */
  CUSTOMER_I18N_LANGUAGE: 'customerI18Lng',
  /** 선택한 admin 다국어 코드 키 */
  ADMIN_I18N_LANGUAGE: 'adminI18Lng',
  /** 선택한 상점 data 키 */
  SHOP: 'shop',
  /** 카테고리 목록 data 키 */
  CATEGORIES: 'menu-categories',
  /** 장바구니 data 키 */
  CART: 'cart-menus',
  /** 테이블 주문 내역 data 키 */
  TABLE_ORDER_HISTORIES: 'table-order-histories',
  /** 선택한 디바이스 data 키 */
  DEVICE: 'device',
  /** 테이블 그룹 data 키 */
  TABLE_GROUP: 'table-group',
  /** 선택한 상점 상세 data 키 */
  SHOP_DETAIL: 'shop-detail',
  /** 객수 data 키 */
  CUSTOMER_COUNT: 'customer-count',
  /** 초기 화면 노출 여부 data 키 */
  INITIAL_PAGE_SHOW: 'initial-page-show',
  /** 비밀번호 인증 완료 여부 키 */
  ADMIN_PASSWORD_VERIFIED: 'admin-password-verified',
} as const;

export const TIMER_KEYS = {
  /** 장바구니 알림 내부 타이머 키 */
  CART_REMINDER: 'cart-reminder',
  /** 카테고리 노출 여부 업데이트 타이머 키 */
  CATEGORY_VISIBILITY_UPDATE: 'category-visibility-update',
  /** 직원 호출 비활성화 타이머 키 */
  DISABLE_STAFF_CALL: 'disable-staff-call',
  /** API 리셋 타이머 키 */
  API_RESET_TIMEOUT: 'api-reset-timeout',
  /** 장바구니 주문 유도 타이머 키 */
  CART_ORDER_REMINDER: 'cart-order-reminder',
  /** 로고 클릭 리셋 타이머 키 */
  LOGO_CLICK_COUNTDOWN_RESET: 'logo-click-countdown-reset',
  /** 브레이크타임 상태 업데이트 타이머 키 */
  BREAK_TIME_UPDATE: 'break-time-update',
  /** 영업마감 상태 업데이트 타이머 키 */
  SHOP_CLOSURE_UPDATE: 'shop-closure-update',
};

export const DOM_IDS = {
  /** 카테고리 섹션 ID 접두사 */
  CATEGORY_SECTION_PREFIX: 'category-',
  /** 카테고리 섹션 ID 생성 함수 */
  getCategorySectionId: (categorySeq: number) => `category-${categorySeq}`,
  /** Contents 스크롤 컨테이너 ID */
  CONTENTS_SCROLL_CONTAINER: 'contents-scroll-container',
} as const;
