import { createAxiosInstance } from '@repo/api/cores';
import type {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosRequestConfig,
} from '@repo/api/axios';
import { openConfirmDialog } from '@repo/feature/utils';
import type { IApiError } from '@repo/api/types';
import { handleApiErrorDialog } from '@repo/api/globalErrorHandler';

const activeErrorTypes = new Set<string>();

/**
 * 인증 없이 요청하고싶을때 사용
 */
export const publicApi = createAxiosInstance({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

publicApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

publicApi.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<IApiError>) => {
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

    // 나머지 모든 error dialog 처리
    handleApiErrorDialog(error, {
      openConfirmDialog,
      activeErrorTypes,
      messages: {
        network: '네트워크 환경이 원활하지 않습니다. 다시 시도해주세요.',
        server500: '알 수 없는 서버 에러가 발생했습니다.',
        unknown: '알 수 없는 오류가 발생했습니다.',
      },
      logLabel: 'publicApi request failed:',
    });
    return Promise.reject(error);
  }
);
