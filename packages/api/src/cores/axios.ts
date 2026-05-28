import axios, {
  AxiosInstance,
  CreateAxiosDefaults,
  type InternalAxiosRequestConfig,
} from 'axios';
import { saveAppLog } from '@repo/util/app';
import {
  applyAndroidIdRequestHeader,
  resolveAndroidIdForHeader,
} from './androidIdHeader';

export const createAxiosInstance = (
  config?: CreateAxiosDefaults
): AxiosInstance => {
  const instance = axios.create({
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
  });

  /**
   * [요청 인터셉터]
   * Authorization 헤더가 이미 채워진 상태로 로그에 기록됩니다.
   */
  instance.interceptors.request.use((reqConfig) => {
    saveAppLog('[API 요청]', {
      method: reqConfig.method?.toUpperCase(),
      url: reqConfig.url,
      baseURL: reqConfig.baseURL,
      authorization: reqConfig.headers?.Authorization as string | undefined,
    });
    return reqConfig;
  });

  /**
   * [Android ID 요청 인터셉터]
   * 네이티브 환경에서만 브릿지 조회 후 X-Android-Id 헤더를 설정합니다.
   * 조회 중인 요청은 동일 in-flight Promise를 await하여 HTTP 전송 전에 완료됩니다.
   */
  instance.interceptors.request.use(
    async (reqConfig: InternalAxiosRequestConfig) => {
      const androidId = await resolveAndroidIdForHeader();
      applyAndroidIdRequestHeader(reqConfig, androidId);
      return reqConfig;
    }
  );

  /**
   * [응답 인터셉터]
   * 앱 레벨 인터셉터보다 먼저 실행됩니다.
   *
   * - 성공(2xx): api_response 태그로 상태 코드와 응답 데이터를 기록합니다.
   * - 오류: api_error 태그로 기록한 뒤 에러를 그대로 다음 핸들러로 전달합니다.
   */
  instance.interceptors.response.use(
    (response) => {
      saveAppLog('[API 응답]', {
        method: response.config?.method?.toUpperCase(),
        url: response.config?.url,
        status: response.status,
      });
      return response;
    },
    (error: unknown) => {
      if (!axios.isCancel(error)) {
        const axiosError = error as {
          config?: { method?: string; url?: string };
          response?: { status?: number; data?: unknown };
          message?: string;
          code?: string;
        };
        saveAppLog('[API 오류]', {
          method: axiosError.config?.method?.toUpperCase(),
          url: axiosError.config?.url,
          status: axiosError.response?.status,
          code: axiosError.code,
          message: axiosError.message,
          responseData: axiosError.response?.data as
            | Record<string, unknown>
            | undefined,
        });
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

const axiosInstanceRegistry = new Map<string, AxiosInstance>();

/**
 * API 클라이언트들을 등록합니다.
 * 각 app에서 시작 시 호출하여 private, public 등의 axios instance를 등록합니다.
 */
export const registerAxiosInstances = (
  instances: Record<string, AxiosInstance>
): void => {
  Object.entries(instances).forEach(([name, instance]) => {
    axiosInstanceRegistry.set(name, instance);
  });
};

/**
 * 등록된 API 클라이언트를 가져옵니다.
 * fetcher 함수들이 내부적으로 사용합니다.
 *
 * @param clientName - 'private', 'public', 'raw' 등
 * @returns AxiosInstance
 */
export const getAxiosInstance = (instanceName: string): AxiosInstance => {
  const instance = axiosInstanceRegistry.get(instanceName);

  if (!instance) {
    throw new Error(`Axios instance "${instanceName}" is not registered. `);
  }

  return instance;
};
