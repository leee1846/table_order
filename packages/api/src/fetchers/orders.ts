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
  IUpdateOrderTableRequest,
  TUpdateOrderTableResponse,
  ICreateOrderGroupRequest,
  TCreateOrderGroupResponse,
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
 * 주문 그룹을 생성합니다.
 * POST /order-group/{shopCode}/{tableNumber}
 */
export const createOrderGroup = async ({
  shopCode,
  tableNumber,
  customerCount,
  kidsCustomerCount,
}: ICreateOrderGroupRequest) => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TCreateOrderGroupResponse>({
    method: 'POST',
    url: ENDPOINTS.ORDER.CREATE_ORDER_GROUP(shopCode, tableNumber),
    params: { customerCount, kidsCustomerCount },
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

/**
 * 주문 테이블을 빈 테이블로 이동합니다.
 * PUT /order/move/{shopCode}
 */
export const moveOrderTable = async ({
  shopCode,
  originalTableNumber,
  targetTableNumber,
}: IUpdateOrderTableRequest): Promise<TUpdateOrderTableResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TUpdateOrderTableResponse>({
    method: 'PUT',
    url: ENDPOINTS.ORDER.MOVE_ORDER_GROUP(shopCode),
    params: { originalTableNumber, targetTableNumber },
  });

  return response.data;
};

/**
 * 점유중인 테이블 주문을 다른 테이블로 합칩니다.
 * PUT /order/share/{shopCode}
 */
export const shareOrderTable = async ({
  shopCode,
  originalTableNumber,
  targetTableNumber,
}: IUpdateOrderTableRequest): Promise<TUpdateOrderTableResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TUpdateOrderTableResponse>({
    method: 'PUT',
    url: ENDPOINTS.ORDER.SHARE_ORDER_GROUP(shopCode),
    params: { originalTableNumber, targetTableNumber },
  });

  return response.data;
};
