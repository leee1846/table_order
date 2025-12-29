import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import type {
  TGetShopsResponse,
  TGetShopResponse,
  TGetShopPageSettingResponse,
  IUpdateShopSettingRequest,
  TUpdateShopSettingResponse,
  TGetShopThemeMenuResponse,
} from '../types/shop';

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

export const getShopPageSetting = async (
  shopCode: string
): Promise<TGetShopPageSettingResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetShopPageSettingResponse>({
    method: 'GET',
    url: ENDPOINTS.SHOP.PAGE_SETTING(shopCode),
  });

  return response.data;
};

export const updateShopSetting = async (
  params: IUpdateShopSettingRequest
): Promise<TUpdateShopSettingResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TUpdateShopSettingResponse>({
    method: 'PUT',
    url: ENDPOINTS.SHOP.SETTING,
    data: params,
  });

  return response.data;
};

export const getShopThemeMenu = async (
  shopCode: string
): Promise<TGetShopThemeMenuResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetShopThemeMenuResponse>({
    method: 'GET',
    url: ENDPOINTS.SHOP.THEME_MENU(shopCode),
  });

  return response.data;
};
