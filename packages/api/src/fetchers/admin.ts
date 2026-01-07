import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import type {
  IGetAdminShopListParams,
  TGetAdminShopListResponse,
} from '../types/admin';

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
