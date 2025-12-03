/**
 * API 엔드포인트 상수들을 정의합니다.
 */
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/login',
    TOKEN_REFRESH: '/token/refresh',
  },

  ORDER: {
    SEND_PICKUP_NOTIFICATION: '/orders/pickup-notification',
    CREATE_TABLE_ORDER: (shopCode: string, tableNumber: number) =>
      `/order/${shopCode}/${tableNumber}`,
  },

  CATEGORY: {
    LIST: '/category/list',
    CREATE: '/category',
    UPDATE: '/category',
    DELETE: '/category',
    MENUBOARD_LIST: (shopCode: string) => `/menuboard/${shopCode}`,
  },

  MENU: {
    LIST: '/menu/list',
    CREATE: '/menu',
    UPDATE: '/menu',
    DELETE: '/menu',
  },

  SHOP: {
    LIST: '/shop/list',
  },
} as const;
