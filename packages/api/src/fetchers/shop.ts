import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import type {
  TGetShopsResponse,
  TGetShopResponse,
  IUpdateShopSettingRequest,
  TUpdateShopSettingResponse,
  TGetShopThemeMenuResponse,
  TGetShopThemePageResponse,
  IUpdateShopThemeMenuRequest,
  TUpdateShopThemeMenuResponse,
  IUpdateShopThemePageRequest,
  TUpdateShopThemePageResponse,
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

export const getShopThemePage = async (
  shopCode: string
): Promise<TGetShopThemePageResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetShopThemePageResponse>({
    method: 'GET',
    url: ENDPOINTS.SHOP.THEME_PAGE(shopCode),
  });

  return response.data;
};

export interface IUpdateShopThemeMenuParams {
  shopCode: string;
  body: IUpdateShopThemeMenuRequest;
  logoFile?: File | null;
}

export const updateShopThemeMenu = async ({
  shopCode,
  body,
  logoFile,
}: IUpdateShopThemeMenuParams): Promise<TUpdateShopThemeMenuResponse> => {
  const axiosInstance = getAxiosInstance('private');

  const formData = new FormData();
  formData.append(
    'shopThemeMenu',
    new Blob([JSON.stringify(body)], { type: 'application/json' })
  );

  if (logoFile) {
    formData.append('logoFile', logoFile);
  }

  const response = await axiosInstance<TUpdateShopThemeMenuResponse>({
    method: 'PUT',
    url: ENDPOINTS.SHOP.THEME_MENU(shopCode),
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

export interface IUpdateShopThemePageParams {
  body: IUpdateShopThemePageRequest;
  initLightFile?: File | null;
  initDarkFile?: File | null;
  orderCompleteFile?: File | null;
  initCommonFiles?: Array<File | null>;
}

export const updateShopThemePage = async ({
  body,
  initLightFile,
  initDarkFile,
  orderCompleteFile,
  initCommonFiles,
}: IUpdateShopThemePageParams): Promise<TUpdateShopThemePageResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const formData = new FormData();

  formData.append(
    'shopPage',
    new Blob([JSON.stringify(body)], { type: 'application/json' })
  );

  if (initLightFile) {
    formData.append('initLightFile', initLightFile);
  }

  if (initDarkFile) {
    formData.append('initDarkFile', initDarkFile);
  }

  if (orderCompleteFile) {
    formData.append('orderCompleteFile', orderCompleteFile);
  }

  initCommonFiles
    ?.filter((file): file is File => Boolean(file))
    .forEach((file) => {
      formData.append('initCommonFiles', file);
    });

  const response = await axiosInstance<TUpdateShopThemePageResponse>({
    method: 'PUT',
    url: ENDPOINTS.SHOP.THEME_PAGE_UPDATE,
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};
