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

const activeErrorTypes = new Set<string>();

const ERROR_TYPES = {
  NETWORK: 'network',
  SERVER_500: 'server_500',
  UNKNOWN: 'unknown',
} as const;

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

    let content: string;
    if (!error.response) {
      // app 로그 확인용
      // eslint-disable-next-line no-console
      console.log(
        'publicApi request failed:',
        JSON.stringify({
          message: error.message,
          code: error.code,
          url: error.config?.url,
          method: error.config?.method,
        })
      );

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
