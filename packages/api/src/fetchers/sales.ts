import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import type {
  IGetSalesSummaryParams,
  IGetOrderHistoryParams,
  TGetSalesSummaryResponse,
  TGetOrderHistoryResponse,
  IGetCardApprovalHistoryParams,
  TGetCardApprovalHistoryResponse,
  IGetMenuSalesSummaryParams,
  TGetMenuSalesSummaryResponse,
} from '../types/sales';

export const getSalesSummary = async (
  params: IGetSalesSummaryParams
): Promise<TGetSalesSummaryResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetSalesSummaryResponse>({
    method: 'GET',
    url: ENDPOINTS.SALES.SUMMARY(params.shopCode),
    params: {
      startDate: params.startDate,
      endDate: params.endDate,
    },
  });

  return response.data;
};

export const getOrderHistory = async (
  params: IGetOrderHistoryParams
): Promise<TGetOrderHistoryResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetOrderHistoryResponse>({
    method: 'GET',
    url: ENDPOINTS.SALES.ORDER_HISTORY(params.shopCode),
    params: {
      startDate: params.startDate,
      endDate: params.endDate,
      pageNumber: params.pageNumber ?? 0,
      pageSize: params.pageSize ?? 10,
    },
  });

  return response.data;
};

export const getCardApprovalHistory = async (
  params: IGetCardApprovalHistoryParams
): Promise<TGetCardApprovalHistoryResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetCardApprovalHistoryResponse>({
    method: 'GET',
    url: ENDPOINTS.SALES.CARD_APPROVAL_HISTORY(params.shopCode),
    params: {
      cardCode: params.cardCode,
      startDate: params.startDate,
      endDate: params.endDate,
      pageNumber: params.pageNumber ?? 0,
      pageSize: params.pageSize ?? 10,
    },
  });

  return response.data;
};

export const getMenuSalesSummary = async (
  params: IGetMenuSalesSummaryParams
): Promise<TGetMenuSalesSummaryResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetMenuSalesSummaryResponse>({
    method: 'GET',
    url: ENDPOINTS.SALES.MENU_SALES_SUMMARY(params.shopCode),
    params: {
      startDate: params.startDate,
      endDate: params.endDate,
    },
  });

  return response.data;
};
