import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import type {
  TAppType,
  TGetLatestAppVersionResponse,
  IGetAppVersionListParams,
  TGetAppVersionListResponse,
  ICreateAppVersionParams,
  TGetAppVersionResponse,
} from '../types/app';
import type { TVoidApiResponse } from '../types/common';

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
  params: IGetAppVersionListParams
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
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');

  const response = await axiosInstance<TVoidApiResponse>({
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
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');

  const response = await axiosInstance<TVoidApiResponse>({
    method: 'PUT',
    url: ENDPOINTS.APP.VERSION,
    data: { ...params, appVersionSeq },
  });

  return response.data;
};
