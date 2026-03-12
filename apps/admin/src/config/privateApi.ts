import { t } from '@/config/i18n';
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
import {
  accessTokenRefreshManager,
  getAccessToken,
  removeAuthTokens,
} from '@repo/api/auth';
import { handleApiErrorDialog } from '@repo/api/globalErrorHandler';
import { ROUTES } from '@/constants/routes';
import { decodeJwtToken } from '@repo/util/function';
import { isExpired } from '@repo/util/date';
import { getCurrentUnixTime } from '@repo/util/time';
import { useAuthStore } from '@/stores/useAuthStore';
import { disconnectSse, initializeSseConnection } from '@/utils/sseConnection';

const activeErrorTypes = new Set<string>();

const forceReLogin = () => {
  removeAuthTokens();
  disconnectSse();
  openConfirmDialog({
    title: t('인증 만료'),
    content: t('인증이 유효하지 않습니다.\n 로그인 후 다시 시도해주세요.'),
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

    // 토큰 만료 30초 전에 갱신 요청
    if (isExpired(payload.exp, 20, getCurrentUnixTime())) {
      accessToken = await accessTokenRefreshManager.runRefresh();
      // 토큰 갱신 후 Store 업데이트
      useAuthStore.getState().refreshTokenInfo();
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

    if (error.response?.status === 401) {
      forceReLogin();
      throw new axios.Cancel('Invalid access token');
    }

    // 나머지 모든 error dialog 처리
    handleApiErrorDialog(error, {
      openConfirmDialog,
      activeErrorTypes,
      messages: {
        network: t('네트워크 환경이 원활하지 않습니다. 다시 시도해주세요.'),
        server500: t('알 수 없는 서버 에러가 발생했습니다.'),
        unknown: t('알 수 없는 오류가 발생했습니다.'),
      },
      logLabel: 'privateApi request failed:',
    });
    return Promise.reject(error);
  }
);

// 개발 환경에서 테스트용으로 노출
// if (import.meta.env.DEV) {
//   (window as unknown as { testPrivateApi: typeof privateApi }).testPrivateApi = privateApi;
// }
