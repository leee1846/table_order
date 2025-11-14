/**
 * API 엔드포인트 상수들을 정의합니다.
 */

export const endpoints = {
  user: {
    list: '/users',
  },
  order: {
    sendPickupNotification: '/orders/pickup-notification',
  },
} as const;
