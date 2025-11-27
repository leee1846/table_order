import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import type {
  ICreateMenuRequest,
  IGetMenuListParams,
  TCreateMenuResponse,
  TGetMenuListResponse,
} from '../types/menu';

export const createMenu = async (
  params: ICreateMenuRequest
): Promise<TCreateMenuResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TCreateMenuResponse>({
    method: 'POST',
    url: ENDPOINTS.MENU.CREATE,
    data: params,
  });

  return response.data;
};

export const getMenuListByCategory = async (
  params: IGetMenuListParams
): Promise<TGetMenuListResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetMenuListResponse>({
    method: 'GET',
    url: ENDPOINTS.MENU.LIST,
    params,
  });

  return response.data;
};
