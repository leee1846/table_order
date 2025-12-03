import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import type {
  ISendPickupNotificationRequest,
  TSendPickupNotificationResponse,
  ICreateTableOrderRequest,
} from '../types/orders';
import type { TVoidApiResponse } from '../types/common';

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

export const createTableOrder = async ({
  shopCode,
  tableNumber,
  orderType,
  orders,
}: ICreateTableOrderRequest) => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'POST',
    url: ENDPOINTS.ORDER.CREATE_TABLE_ORDER(shopCode, tableNumber),
    params: { orderType },
    data: orders,
  });

  return response.data;
};
