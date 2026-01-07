import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import type {
  IGetAdminShopListParams,
  IGetAdminShopListResponse,
} from '../types/admin';

export const getAdminShopList = async (
  params: IGetAdminShopListParams
): Promise<IGetAdminShopListResponse> => {
  const axiosInstance = getAxiosInstance('private');

  const response = await axiosInstance<IGetAdminShopListResponse>({
    method: 'GET',
    url: ENDPOINTS.ADMIN.SHOP_LIST,
    params,
  });

  return response.data;
};
