export const EVENT_KEYS = {
  SIDEBAR_CATEGORY_TAB_CLICK_EVENT_KEY: (id: number) =>
    `sidebar-category-tab-click-${id}`,

  SCROLL_CATEGORY_VISIBLE_EVENT_KEY: (id: number) =>
    `scroll-category-visible-${id}`,
};

export const STORAGE_KEYS = {
  /** 카테고리 목록 data 키 */
  CATEGORIES: 'menu-categories',
  /** 선택한 다국어 코드 키 */
  I18N_LANGUAGE: 'i18Lng',
} as const;

export const timerKeys = {
  /** 장바구니 알림 내부 타이머 키 */
  CART_REMINDER: 'cart-reminder',
  /** 카테고리 노출 여부 업데이트 타이머 키 */
  CATEGORY_VISIBILITY_UPDATE: 'category-visibility-update',
};
