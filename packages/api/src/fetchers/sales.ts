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
  IGetOneDaySalesParams,
  TGetOneDaySalesResponse,
  IGetDailySalesParams,
  TGetDailySalesResponse,
  IGetHourlySalesParams,
  TGetHourlySalesResponse,
  IGetMenuSalesHistoryParams,
  TGetMenuSalesHistoryResponse,
  IGetCalendarSalesParams,
  TGetCalendarSalesResponse,
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

export const getOneDaySales = async (
  params: IGetOneDaySalesParams
): Promise<TGetOneDaySalesResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const requestParams: Record<string, string> = {
    saleDate: params.saleDate,
  };

  if (params.paymentType) {
    requestParams.paymentType = params.paymentType;
  }

  const response = await axiosInstance<TGetOneDaySalesResponse>({
    method: 'GET',
    url: ENDPOINTS.SALES.ONE_DAY_SALES(params.shopCode),
    params: requestParams,
  });

  return response.data;
};

export const getDailySales = async (
  params: IGetDailySalesParams
): Promise<TGetDailySalesResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetDailySalesResponse>({
    method: 'GET',
    url: ENDPOINTS.SALES.DAILY_SALES(params.shopCode),
    params: {
      startDate: params.startDate,
      endDate: params.endDate,
    },
  });

  return response.data;
};

export const getHourlySales = async (
  params: IGetHourlySalesParams
): Promise<TGetHourlySalesResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetHourlySalesResponse>({
    method: 'GET',
    url: ENDPOINTS.SALES.HOURLY_SALES(params.shopCode),
    params: {
      startDate: params.startDate,
      endDate: params.endDate,
    },
  });

  return response.data;
};

export const getMenuSalesHistory = async (
  params: IGetMenuSalesHistoryParams
): Promise<TGetMenuSalesHistoryResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetMenuSalesHistoryResponse>({
    method: 'GET',
    url: ENDPOINTS.SALES.MENU_SALES_HISTORY(params.shopCode),
    params: {
      startDate: params.startDate,
      endDate: params.endDate,
    },
  });

  return response.data;
};

export const getCalendarSales = async (
  params: IGetCalendarSalesParams
): Promise<TGetCalendarSalesResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetCalendarSalesResponse>({
    method: 'GET',
    url: ENDPOINTS.SALES.CALENDAR_SALES(params.shopCode),
    params: {
      yearMonth: params.yearMonth,
    },
  });

  return response.data;
};
