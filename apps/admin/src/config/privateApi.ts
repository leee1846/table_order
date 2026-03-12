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
import { ROUTES } from '@/constants/routes';
import { decodeJwtToken } from '@repo/util/function';
import { isExpired } from '@repo/util/date';
import { getCurrentUnixTime } from '@repo/util/time';
import { useAuthStore } from '@/stores/useAuthStore';
import { disconnectSse, initializeSseConnection } from '@/utils/sseConnection';

const ERROR_TYPES = {
  NETWORK: 'network',
  SERVER_500: 'server_500',
  UNKNOWN: 'unknown',
} as const;

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
    let content: string;
    if (!error.response) {
      // app 로그 확인용
      // eslint-disable-next-line no-console
      console.log(
        'privateApi request failed:',
        JSON.stringify({
          message: error.message,
          code: error.code,
          url: error.config?.url,
          method: error.config?.method,
        })
      );

      // 서버에 도달하지 못한 error (ex. timeout)
      content = t('API 요청에 실패하였습니다.');
      if (!activeErrorTypes.has(ERROR_TYPES.NETWORK)) {
        activeErrorTypes.add(ERROR_TYPES.NETWORK);
        openConfirmDialog({
          title: 'Server Error',
          content,
          onConfirm: () => {
            activeErrorTypes.delete(ERROR_TYPES.NETWORK);
          },
        });
      }
    } else if (error.response.status === 500) {
      content = t('알 수 없는 서버 에러가 발생했습니다.');
      if (!activeErrorTypes.has(ERROR_TYPES.SERVER_500)) {
        activeErrorTypes.add(ERROR_TYPES.SERVER_500);
        openConfirmDialog({
          title: 'Server Error',
          content,
          onConfirm: () => {
            activeErrorTypes.delete(ERROR_TYPES.SERVER_500);
          },
        });
      }
    } else if (!error.response?.data?.status?.userMessage) {
      content = t('알 수 없는 오류가 발생했습니다.');
      if (!activeErrorTypes.has(ERROR_TYPES.UNKNOWN)) {
        activeErrorTypes.add(ERROR_TYPES.UNKNOWN);
        openConfirmDialog({
          title: 'Server Error',
          content,
          onConfirm: () => {
            activeErrorTypes.delete(ERROR_TYPES.UNKNOWN);
          },
        });
      }
    } else {
      // userMessage가 있는 경우는 항상 모달 표시 (중첩 방지 없음)
      content = error.response.data.status.userMessage;
      openConfirmDialog({
        title: 'Server Error',
        content,
      });
    }
    return Promise.reject(error);
  }
);

// 개발 환경에서 테스트용으로 노출
// if (import.meta.env.DEV) {
//   (window as unknown as { testPrivateApi: typeof privateApi }).testPrivateApi = privateApi;
// }
