/**
 * @repo/api
 *
 * 공통 API 패키지
 * axios와 @tanstack/react-query 기반의 API 호출 및 상태 관리
 */

// Core exports
export { apiClient, createApiClient, initializeApiClient } from './cores/axios';
export { endpoints } from './cores/endpoints';

// React Query re-exports (전체 모듈)
export * from '@tanstack/react-query';

// Type exports
export type {
  ISendPickupNotificationRequest,
  ISendPickupNotificationResponse,
} from './types/orders';

// Query exports (React Query hooks)
export { orderKeys } from './queries/orders/keys';
export { usePostPickupNotification } from './queries/orders/usePostPickupNotification';
