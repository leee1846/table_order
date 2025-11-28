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
  },
  CATEGORY: {
    LIST: '/category/list',
    CREATE: '/category',
    UPDATE: '/category',
    DELETE: '/category',
  },
  MENU: {
    LIST: '/menu/list',
    CREATE: '/menu',
    UPDATE: '/menu',
    DELETE: '/menu',
  },
} as const;
