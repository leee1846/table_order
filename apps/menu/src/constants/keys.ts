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
  /** 상점 테마 메뉴 data 키 */
  SHOP_THEME_MENU: 'shop-theme-menu',
  /** 상점 테마 페이지 data 키 */
  SHOP_THEME_PAGE: 'shop-theme-page',
  /** 디바이스 리스트 data 키 */
  DEVICE_LIST: 'device-list',
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
  /** 라스트오더 시간 업데이트 타이머 키 */
  LAST_ORDER_REMAINING_TIME_UPDATE: 'last-order-remaining-time-update',
  /** 헤더 알림 문구 업데이트 타이머 키 */
  HEADER_ALERT_MESSAGE_UPDATE: 'header-alert-message-update',
  /** POS 동기화 상태 폴링 타이머 키 */
  POS_SYNC_POLLING: 'pos-sync-polling',
  /** 초기 화면 스와이퍼 자동 재생 타이머 키 */
  INITIAL_PAGE_SWIPER_AUTOPLAY: 'initial-page-swiper-autoplay',
};

export const SSE_KEYS = {
  /** SSE 연결 키 */
  MAIN_CONNECTION: 'sse-main-connection',
} as const;

/** 테이블 그룹 선택 키 */
export const TABLE_GROUP_STORAGE_KEY = 'selectedTableGroupSeq';

export const DOM_IDS = {
  /** 카테고리 섹션 ID 접두사 */
  CATEGORY_SECTION_PREFIX: 'category-',
  /** 카테고리 섹션 ID 생성 함수 */
  getCategorySectionId: (categorySeq: number) => `category-${categorySeq}`,
  /** Contents 스크롤 컨테이너 ID */
  CONTENTS_SCROLL_CONTAINER: 'contents-scroll-container',
} as const;
