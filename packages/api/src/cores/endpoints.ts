/**
 * API 엔드포인트 상수들을 정의합니다.
 */
export const ENDPOINTS = {
  COMMON: {
    HOLIDAYS: '/holidays',
  },

  AUTH: {
    LOGIN: '/login',
    TOKEN_REFRESH: '/token/refresh',
    LOGIN_MENUBOARD_ADMIN: '/login/menuboard',
  },

  ORDER: {
    SEND_PICKUP_NOTIFICATION: '/orders/pickup-notification',
    CREATE_ORDER_GROUP: (shopCode: string, tableNumber: number) =>
      `/order-group/${shopCode}/${tableNumber}`,
    CREATE_TABLE_ORDER: (shopCode: string, tableNumber: number) =>
      `/order/${shopCode}/${tableNumber}`,
    TABLE_ORDER_HISTORY: (shopCode: string, tableNumber: number) =>
      `/order/${shopCode}/${tableNumber}`,
    CURRENT_TABLE_LIST: (shopCode: string) => `/order/${shopCode}`,
    CANCEL_MENU: '/order/cancel/menu',
    MOVE_ORDER_GROUP: (shopCode: string) => `/order/move/${shopCode}`,
    SHARE_ORDER_GROUP: (shopCode: string) => `/order/share/${shopCode}`,
  },

  CATEGORY: {
    LIST: '/category/list',
    CREATE: '/category',
    UPDATE: '/category',
    DELETE: '/category',
    INDEX_UPDATE: '/category/index',
    HIDDEN: '/category/hidden',
    MENUBOARD_LIST: (shopCode: string) => `/menuboard/${shopCode}`,
  },

  MENU: {
    LIST: '/menu/list',
    CREATE: '/menu',
    UPDATE: '/menu',
    DELETE: '/menu',
    INDEX_UPDATE: '/menu/index',
    HIDDEN: '/menu/hidden',
    OUT_OF_STOCK: '/menu/out-of-stock',
  },

  SHOP: {
    DETAIL: (shopCode: string) => `/shop/${shopCode}`,
    LIST: '/shop/list',
  },

  TABLE: {
    GROUP_LIST: (shopCode: string) => `/table-group/${shopCode}`,
    GROUP_CREATE: '/table-group',
    GROUP_UPDATE: '/table-group',
    GROUP_DELETE: '/table-group',
    CREATE: '/table',
    UPDATE: '/table',
    DELETE: '/table',
  },

  DEVICE: {
    SHOP: (shopCode: string) => `/device/${shopCode}`,
  },

  SSE: {
    CONNECT: '/sse/connect',
  },
} as const;
