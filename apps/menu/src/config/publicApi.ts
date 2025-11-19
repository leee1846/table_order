import { createAxiosInstance } from '@repo/api/cores';
import type {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosRequestConfig,
} from '@repo/api/axios';
import { openConfirmDialog } from '@repo/feature/utils';
import type { IApiError } from '@repo/api/types';

export const publicApi = createAxiosInstance({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

publicApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log('이건 퍼블릭');
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
    const ignoreGlobalErrors = (
      error.config as AxiosRequestConfig & { ignoreGlobalErrors?: number[] }
    )?.ignoreGlobalErrors;
    const statusCode = error.response?.status;

    if (
      ignoreGlobalErrors &&
      statusCode &&
      ignoreGlobalErrors.includes(statusCode)
    ) {
      return Promise.reject(error);
    }

    openConfirmDialog({
      title: 'Server Error',
      content:
        error.response?.data?.status?.userMessage ||
        '알 수 없는 오류가 발생했습니다.',
    });
    return Promise.reject(error);
  }
);
