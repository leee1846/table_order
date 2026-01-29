import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import type {
  TAppType,
  TGetLatestAppVersionResponse,
  TGetAppVersionListResponse,
  ICreateAppVersionParams,
  TGetAppVersionResponse,
  TPostAppVersionResponse,
} from '../types/app';
import type { IPaginationParams, TVoidApiResponse } from '../types/common';

export const getLatestAppVersion = async (
  appType: TAppType
): Promise<TGetLatestAppVersionResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetLatestAppVersionResponse>({
    method: 'GET',
    url: ENDPOINTS.APP.LATEST_VERSION(appType),
  });

  return response.data;
};

export const getAppVersionList = async (
  params: IPaginationParams
): Promise<TGetAppVersionListResponse> => {
  const axiosInstance = getAxiosInstance('private');

  const response = await axiosInstance<TGetAppVersionListResponse>({
    method: 'GET',
    url: ENDPOINTS.APP.VERSION_LIST,
    params,
  });

  return response.data;
};

export const createAppVersion = async (
  params: ICreateAppVersionParams
): Promise<TPostAppVersionResponse> => {
  const axiosInstance = getAxiosInstance('private');

  const response = await axiosInstance<TPostAppVersionResponse>({
    method: 'POST',
    url: ENDPOINTS.APP.VERSION,
    data: params,
  });

  return response.data;
};

export const getAppVersionDetail = async (
  appVersionSeq: number
): Promise<TGetAppVersionResponse> => {
  const axiosInstance = getAxiosInstance('private');

  const response = await axiosInstance<TGetAppVersionResponse>({
    method: 'GET',
    url: ENDPOINTS.APP.VERSION,
    params: {
      appVersionSeq,
    },
  });

  return response.data;
};

export const updateAppVersion = async (
  appVersionSeq: number,
  params: ICreateAppVersionParams & { appVersionSeq: number }
): Promise<TPostAppVersionResponse> => {
  const axiosInstance = getAxiosInstance('private');

  const response = await axiosInstance<TPostAppVersionResponse>({
    method: 'PUT',
    url: ENDPOINTS.APP.VERSION,
    data: { ...params, appVersionSeq },
  });

  return response.data;
};

export const postAppVersionFile = async (
  appVersionSeq: number,
  file: File
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosInstance<TVoidApiResponse>({
    method: 'POST',
    url: ENDPOINTS.APP.APP_VERSION_FILE(appVersionSeq),
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
