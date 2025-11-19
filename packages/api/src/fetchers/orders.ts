import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import type {
  ISendPickupNotificationRequest,
  TSendPickupNotificationResponse,
} from '../types/orders';

/**
 * 픽업 알림을 전송합니다.
 */
export const sendPickupNotification = async (
  data: ISendPickupNotificationRequest
) => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TSendPickupNotificationResponse>({
    method: 'POST',
    url: ENDPOINTS.ORDER.SEND_PICKUP_NOTIFICATION,
    data,
  });

  return response.data;
};
