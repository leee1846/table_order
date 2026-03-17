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
  ICancelOrderMenuRequest,
  ICancelOrderAllRequest,
  IClearOrderRequest,
  IPostCustomAmountRequest,
  IPostPickupMessageRequest,
  TPostPickupMessageResponse,
  TCreateTableOrderResponse,
  IGetOrderLogParams,
  TGetOrderLogResponse,
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
  ignoreGlobalErrors,
}: ICreateOrderGroupRequest & { ignoreGlobalErrors?: number[] }) => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TCreateOrderGroupResponse>({
    method: 'POST',
    url: ENDPOINTS.ORDER.CREATE_ORDER_GROUP(shopCode, tableNumber),
    params: { customerCount, kidsCustomerCount },
    ignoreGlobalErrors,
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
  ignoreGlobalErrors,
}: ICreateTableOrderRequest & { ignoreGlobalErrors?: number[] }) => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TCreateTableOrderResponse>({
    method: 'POST',
    url: ENDPOINTS.ORDER.CREATE_TABLE_ORDER(shopCode, tableNumber),
    params: { orderType, customerCount, kidsCustomerCount, totalAmount },
    data: orders,
    ignoreGlobalErrors,
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
  ignoreGlobalErrors,
}: IGetTableOrderHistoriesParams & {
  ignoreGlobalErrors?: number[];
}): Promise<TGetTableOrderHistoriesResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetTableOrderHistoriesResponse>({
    method: 'GET',
    url: ENDPOINTS.ORDER.TABLE_ORDER_HISTORY(shopCode, tableNumber),
    ignoreGlobalErrors,
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
 * 주문 로그 목록을 조회합니다. (페이징)
 * GET /order/log/{shopCode}
 */
export const getOrderLogList = async ({
  shopCode,
  pageNumber,
  pageSize,
}: IGetOrderLogParams): Promise<TGetOrderLogResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetOrderLogResponse>({
    method: 'GET',
    url: ENDPOINTS.ORDER.ORDER_LOG_LIST(shopCode),
    params: {
      pageNumber: pageNumber ?? 0,
      pageSize: pageSize ?? 10,
    },
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

/**
 * 주문 상세 메뉴를 선택 취소합니다.
 * PUT /order/cancel/menu
 */
export const cancelOrderMenu = async (
  data: ICancelOrderMenuRequest
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'PUT',
    url: ENDPOINTS.ORDER.CANCEL_MENU,
    data,
  });

  return response.data;
};

/**
 * 주문 전체 메뉴를 취소합니다.
 * PUT /order/cancel/{shopCode}/{tableNumber}
 */
export const cancelOrderAll = async ({
  shopCode,
  tableNumber,
}: ICancelOrderAllRequest): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'PUT',
    url: ENDPOINTS.ORDER.CANCEL_ALL(shopCode, tableNumber),
  });

  return response.data;
};

/**
 * 현재 테이블 주문을 비우고 상태를 초기화합니다.
 * PUT /order/clear/{shopCode}/{tableNumber}
 */
export const clearOrder = async ({
  shopCode,
  tableNumber,
}: IClearOrderRequest): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'PUT',
    url: ENDPOINTS.ORDER.CLEAR_ORDER(shopCode, tableNumber),
  });

  return response.data;
};

/**
 * 주문 금액을 변경합니다.
 * POST /order/custom-amount
 */
export const postCustomAmount = async (
  data: IPostCustomAmountRequest
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'POST',
    url: ENDPOINTS.ORDER.CUSTOM_AMOUNT,
    data,
  });

  return response.data;
};

/**
 * 픽업 메시지를 전송합니다.
 * POST /order/pickup/{shopCode}/{tableNumber}
 */
export const postPickupMessage = async ({
  shopCode,
  tableNumber,
  message,
}: IPostPickupMessageRequest): Promise<TPostPickupMessageResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TPostPickupMessageResponse>({
    method: 'POST',
    url: ENDPOINTS.ORDER.PICKUP(shopCode, tableNumber),
    params: { message },
  });

  return response.data;
};

export const postOrderOnboardingTest = async (
  shopCode: string
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'POST',
    url: ENDPOINTS.ORDER.ORDER_ONBOARDING_TEST(shopCode),
  });

  return response.data;
};

export const getOrderPosCallbackCheck = async (
  shopCode: string,
  orderUuid: string
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'GET',
    url: ENDPOINTS.ORDER.ORDER_POS_CALLBACK_CHECK(shopCode),
    params: {
      orderUuid,
    },
  });

  return response.data;
};
