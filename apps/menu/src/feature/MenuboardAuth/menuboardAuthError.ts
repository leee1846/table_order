import { axios, type AxiosError } from '@repo/api/axios';
import type { IApiError } from '@repo/api/types';
import { isMenuboardProtectedUrl } from './menuboardProtectedEndpoints';

/** 관리자 모드 X-Menuboard-Token 만료(403, -106) 여부 */
export const isMenuboardTokenExpiredError = (
  error: unknown
): error is AxiosError<IApiError> => {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  const config = error.config;
  return (
    error.response?.status === 403 &&
    error.response?.data?.status?.code === -106 &&
    isMenuboardProtectedUrl(config?.url ?? '', config?.method ?? '')
  );
};
