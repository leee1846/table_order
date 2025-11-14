/**
 * Order 관련 React Query Key 팩토리
 */
export const orderKeys = {
  all: ['orders'] as const,
  pickupNotification: (orderId: string) =>
    ['orders', 'pickup-notification', orderId] as const,
} as const;
