import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import { TVoidApiResponse } from '../types/common';
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
  ICreateShopRequest,
  TShopLogType,
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
  shopCode: string;
  body: IUpdateShopThemePageRequest;
  initLightFile?: { file: File; fileName: string };
  initDarkFile?: { file: File; fileName: string };
  orderCompleteFile?: { file: File; fileName: string };
  initCommonFiles?: Array<{ file: File; fileName: string }>;
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
    formData.append(
      'initLightFile',
      initLightFile.file,
      initLightFile.fileName
    );
  }

  if (initDarkFile) {
    formData.append('initDarkFile', initDarkFile.file, initDarkFile.fileName);
  }

  if (orderCompleteFile) {
    formData.append(
      'orderCompleteFile',
      orderCompleteFile.file,
      orderCompleteFile.fileName
    );
  }

  initCommonFiles?.forEach(({ file, fileName }) => {
    formData.append('initCommonFiles', file, fileName);
  });

  const response = await axiosInstance<TUpdateShopThemePageResponse>({
    method: 'PUT',
    url: ENDPOINTS.SHOP.THEME_PAGE_UPDATE(),
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

export const createShop = async (
  params: ICreateShopRequest
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'POST',
    url: ENDPOINTS.SHOP.CREATE,
    data: params,
  });

  return response.data;
};

export const createShopLog = async (
  shopCode: string,
  type: TShopLogType,
  logText: string,
  fileName = `${type.toLowerCase()}.log`
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');

  const formData = new FormData();
  formData.append(
    'file',
    new File([logText], fileName, { type: 'text/plain' })
  );

  const response = await axiosInstance<TVoidApiResponse>({
    method: 'POST',
    url: ENDPOINTS.SHOP.LOG(shopCode, type),
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
