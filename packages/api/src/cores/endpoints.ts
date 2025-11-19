/**
 * API 엔드포인트 상수들을 정의합니다.
 */
export const endpoints = {
  auth: {
    login: '/login',
  },
  order: {
    sendPickupNotification: '/orders/pickup-notification',
  },
} as const;
