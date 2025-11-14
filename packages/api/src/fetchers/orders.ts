import { apiClient } from '../cores/axios';
import { endpoints } from '../cores/endpoints';
import type {
  ISendPickupNotificationRequest,
  ISendPickupNotificationResponse,
} from '../types/orders';

/**
 * 픽업 알림을 전송합니다.
 */
export const sendPickupNotification = async (
  data: ISendPickupNotificationRequest
) => {
  return apiClient<ISendPickupNotificationResponse>({
    method: 'POST',
    url: endpoints.order.sendPickupNotification,
    data,
  }).then((response) => response.data);
};
