import { t } from '@/config/i18n';
import { createAxiosInstance } from '@repo/api/cores';
import type {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosRequestConfig,
} from '@repo/api/axios';
import type { IApiError } from '@repo/api/types';
import { openConfirmDialog } from '@repo/feature/utils';
import { handleApiErrorDialog } from '@repo/api/globalErrorHandler';

const activeErrorTypes = new Set<string>();

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

    handleApiErrorDialog(error, {
      openConfirmDialog,
      activeErrorTypes,
      messages: {
        network: t('네트워크 환경이 원활하지 않습니다. 다시 시도해주세요.'),
        server500: t('알 수 없는 서버 에러가 발생했습니다.'),
        unknown: t('알 수 없는 오류가 발생했습니다.'),
      },
      logLabel: 'publicApi request failed:',
    });
    return Promise.reject(error);
  }
);
