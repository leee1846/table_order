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

// 인증 만료 다이얼로그 중복 노출 방지 (forceReLogin 1회만 실행되도록 보장)
let hasForceReLoginCalled = false;

const forceReLogin = (reason: string) => {
  if (hasForceReLoginCalled) { return; }
  hasForceReLoginCalled = true;

  const accessToken = getAccessToken();
  const tokenPayload = accessToken
    ? decodeJwtToken<ITokenPayload>(accessToken)
    : null;

  // app 로그 확인용
  // eslint-disable-next-line no-console
  console.log(
    '인증만료 (로그아웃) 발생:',
    JSON.stringify({
      reason,
      token: accessToken,
      tokenExp: tokenPayload?.exp ?? null,
      currentTime: getCurrentUnixTime(),
    })
  );

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
  onRefreshFailed: () => forceReLogin('refresh-token-expired'),
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
      forceReLogin('request-no-access-token');
      throw new axios.Cancel('No access token');
    }

    // 토큰이 유효하지 않을경우
    const payload = decodeJwtToken<ITokenPayload>(accessToken);
    if (!payload) {
      forceReLogin('request-invalid-token-payload');
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
  async (error: AxiosError<IApiError>) => {
    // interceptor 취소 에러일경우
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    // 토큰 리프레시 실패 시, 에러처리는 accessTokenRefreshManager.configure 에서 처리
    if (accessTokenRefreshManager.isRefreshFailed()) {
      return Promise.reject(error);
    }

    const config = error.config as AxiosRequestConfig & {
      ignoreGlobalErrors?: number[];
      _retry?: boolean;
    };
    const statusCode = error.response?.status;
    const ignoreGlobalErrors = config?.ignoreGlobalErrors ?? [];

    // 토큰 만료: 1회 갱신 후 재시도, 재시도 후에도 401이면 로그아웃
    if (statusCode === 401) {
      if (!config?._retry) {
        config._retry = true;
        try {
          await accessTokenRefreshManager.runRefresh();
          // 토큰 갱신 후 Store 업데이트 (request interceptor와 동일하게 처리)
          useAuthStore.getState().refreshTokenInfo();
          // 갱신 성공: request interceptor가 새 토큰을 Authorization 헤더에 주입
          return privateApi(config);
        } catch {
          if (accessTokenRefreshManager.isRefreshFailed()) {
            // refresh 자체가 401 → onRefreshFailed(forceReLogin) 이미 처리됨
            return Promise.reject(error);
          }

          // refresh 네트워크/서버 오류 → 원본 에러 전파
          return Promise.reject(error);
        }
      }

      // 재시도 후에도 401 → 로그아웃
      forceReLogin('response-retry-401');
      throw new axios.Cancel('Invalid access token');
    }

    // tanstack query 커스텀 hook 실행시 무시하고싶은 error code가 존재할경우
    if (
      ignoreGlobalErrors &&
      statusCode &&
      ignoreGlobalErrors.includes(statusCode)
    ) {
      return Promise.reject(error);
    }

    const skipGlobalErrorHandling =
      (config as AxiosRequestConfig)?.skipGlobalErrorHandling === true;
    if (skipGlobalErrorHandling) {
      return Promise.reject(error);
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
