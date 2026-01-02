import { accessTokenRefreshManager, getAccessToken } from '@repo/api/auth';
import { createAxiosInstance } from '@repo/api/cores';
import {
  axios,
  type AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosRequestConfig,
} from '@repo/api/axios';
import type { IApiError, ITokenPayload } from '@repo/api/types';
import { openConfirmDialog } from '@repo/feature/utils';
import { isExpired } from '@repo/util/date';
import { decodeJwtToken } from '@repo/util/function';
import { getCurrentUnixTime } from '@repo/util/time';
import { ROUTES } from '@/constants/routes';
import { clearAuthData } from '@/utils/auth';
import { disconnectSse, initializeSseConnection } from '@/utils/sseConnection';

const forceReLogin = () => {
  clearAuthData();
  openConfirmDialog({
    title: '인증 만료',
    content: '인증이 유효하지 않습니다.\n 로그인 후 다시 시도해주세요.',
    onConfirm: () => {
      window.location.href = ROUTES.LOGIN.generate();
    },
  });
};

accessTokenRefreshManager.configure({
  onRefreshFailed: forceReLogin,
  reconnectSse: initializeSseConnection,
  disconnectSse,
});

/**
 * 인증 있는 요청하고싶을때 사용
 */
export const privateApi = createAxiosInstance({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

privateApi.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    let accessToken = getAccessToken();

    // 토큰이 없을경우
    if (!accessToken) {
      forceReLogin();
      throw new axios.Cancel('No access token');
    }

    // 토큰이 유효하지 않을경우
    const payload = decodeJwtToken<ITokenPayload>(accessToken);
    if (!payload) {
      forceReLogin();
      throw new axios.Cancel('Invalid access token');
    }

    // 토큰 만료 120초 전에 갱신 요청
    if (isExpired(payload.exp, 120, getCurrentUnixTime())) {
      accessToken = await accessTokenRefreshManager.runRefresh();
    }

    // 토큰 헤더 추가
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

privateApi.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<IApiError>) => {
    // interceptor 취소 에러일경우
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    // 토큰 리프레시 실패 시, 에러처리는 accessTokenRefreshManager.configure 에서 처리
    if (accessTokenRefreshManager.isRefreshFailed()) {
      return Promise.reject(error);
    }

    const config = error.config as AxiosRequestConfig;
    const statusCode = error.response?.status;
    const ignoreGlobalErrors =
      (config as AxiosRequestConfig & { ignoreGlobalErrors?: number[] })
        ?.ignoreGlobalErrors ?? [];

    // tanstack query 커스텀 hook 실행시 무시하고싶은 error code가 존재할경우
    if (
      ignoreGlobalErrors &&
      statusCode &&
      ignoreGlobalErrors.includes(statusCode)
    ) {
      return Promise.reject(error);
    }

    // 토큰 만료 or 토큰 존재하지 않을경우, 재요청하여 request interceptor에서 처리
    if (error.response?.status === 401) {
      return privateApi(config);
    }

    // 나머지 모든 error dialog 처리
    openConfirmDialog({
      title: 'Server Error',
      content:
        error.response?.data?.status?.userMessage ||
        '알 수 없는 오류가 발생했습니다.',
    });
    return Promise.reject(error);
  }
);
