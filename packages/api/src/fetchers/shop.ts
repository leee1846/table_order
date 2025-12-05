import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import type { TGetShopsResponse, TGetShopResponse } from '../types/shop';

export const getShops = async (): Promise<TGetShopsResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetShopsResponse>({
    method: 'GET',
    url: ENDPOINTS.SHOP.LIST,
  });

  return response.data;
};

export const getShopDetail = async (
  shopCode: string
): Promise<TGetShopResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetShopResponse>({
    method: 'GET',
    url: ENDPOINTS.SHOP.DETAIL(shopCode),
  });

  return response.data;
};
