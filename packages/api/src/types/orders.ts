import type { IApiResponse } from './common';

/**
 * 픽업 알림 전송 요청 타입
 */
export interface ISendPickupNotificationRequest {
  orderId: string;
  message: string;
}

/**
 * 픽업 알림 전송 응답 타입
 */
export interface ISendPickupNotificationData {
  success: boolean;
  message?: string;
}

/**
 * 픽업 알림 전송 응답 타입 (IApiResponse 래핑)
 */
export type TSendPickupNotificationResponse =
  IApiResponse<ISendPickupNotificationData>;
