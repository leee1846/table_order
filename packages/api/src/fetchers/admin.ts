import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import type {
  IGetAdminShopListParams,
  TGetAdminShopDetailResponse,
  TGetAdminShopListResponse,
  IGetAdminShopDetail,
} from '../types/admin';
import { TVoidApiResponse } from '../types/common';

export const getAdminShopList = async (
  params: IGetAdminShopListParams
): Promise<TGetAdminShopListResponse> => {
  const axiosInstance = getAxiosInstance('private');

  const response = await axiosInstance<TGetAdminShopListResponse>({
    method: 'GET',
    url: ENDPOINTS.ADMIN.SHOP_LIST,
    params,
  });

  return response.data;
};

export const getAdminShopDetail = async (
  shopCode: string
): Promise<TGetAdminShopDetailResponse> => {
  const axiosInstance = getAxiosInstance('private');

  const response = await axiosInstance<TGetAdminShopDetailResponse>({
    method: 'GET',
    url: ENDPOINTS.ADMIN.SHOP_DETAIL(shopCode),
  });

  return response.data;
};

export const updateAdminShop = async (
  params: IGetAdminShopDetail
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');

  const response = await axiosInstance<TVoidApiResponse>({
    method: 'PUT',
    url: ENDPOINTS.ADMIN.SHOP,
    data: params,
  });

  return response.data;
};
