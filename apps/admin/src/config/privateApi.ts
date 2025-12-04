import { createAxiosInstance } from '@repo/api/cores';
import type {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosRequestConfig,
} from '@repo/api/axios';
import type { IApiError } from '@repo/api/types';
import { openConfirmDialog } from '@repo/feature/utils';

export const privateApi = createAxiosInstance({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

privateApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJORVhBMDAwMDAxIiwicm9sZSI6IlNIT1AiLCJzaG9wU2VxIjoxLCJ0b2tlbl90eXBlIjoiYWNjZXNzX3Rva2VuIiwiaWF0IjoxNzY0ODM1OTcwLCJleHAiOjE3NjQ4NDY3NzB9.9VGiKWkoyhi8eOnJ4MuCk3jWAc-R9xyWRdsArk2FxXJzneVh2aUVgQh9n_Ypw8yBXGC6zQ0jr_9QEMt4qZHeFw';
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
