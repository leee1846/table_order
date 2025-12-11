import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import type {
  ISendPickupNotificationRequest,
  TSendPickupNotificationResponse,
  ICreateTableOrderRequest,
  TGetTableOrderHistoriesResponse,
  IGetTableOrderHistoriesParams,
  TGetCurrentTableListResponse,
  IGetCurrentTableListParams,
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

/**
 * 테이블 후불 주문을 생성합니다.
 * POST /order/{shopCode}/{tableNumber}
 */
export const createTableOrder = async ({
  shopCode,
  tableNumber,
  orderType,
  orders,
  customerCount,
  kidsCustomerCount,
  totalAmount,
}: ICreateTableOrderRequest) => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'POST',
    url: ENDPOINTS.ORDER.CREATE_TABLE_ORDER(shopCode, tableNumber),
    params: { orderType, customerCount, kidsCustomerCount, totalAmount },
    data: orders,
  });

  return response.data;
};

/**
 * 테이블 주문 내역을 조회합니다.
 * GET /order/{shopCode}/{tableNumber}
 */
export const getTableOrderHistories = async ({
  shopCode,
  tableNumber,
}: IGetTableOrderHistoriesParams): Promise<TGetTableOrderHistoriesResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetTableOrderHistoriesResponse>({
    method: 'GET',
    url: ENDPOINTS.ORDER.TABLE_ORDER_HISTORY(shopCode, tableNumber),
  });

  return response.data;
};

/**
 * 테이블 그룹 및 주문 조회
 * GET /order/{shopCode}
 */
export const getCurrentTableList = async ({
  shopCode,
}: IGetCurrentTableListParams): Promise<TGetCurrentTableListResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetCurrentTableListResponse>({
    method: 'GET',
    url: ENDPOINTS.ORDER.CURRENT_TABLE_LIST(shopCode),
  });

  return response.data;
};
