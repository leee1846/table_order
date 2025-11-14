import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios';

/**
 * 기본 axios 인스턴스를 생성합니다.
 */
export const createApiClient = (
  config?: CreateAxiosDefaults
): AxiosInstance => {
  const instance = axios.create({
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
  });

  return instance;
};

/**
 * API 클라이언트 인스턴스 (모듈 레벨 변수)
 * initializeApiClient로 초기화되어야 합니다.
 */
let apiClientInstance: AxiosInstance | null = null;

/**
 * API 클라이언트를 초기화합니다.
 * 각 앱에서 앱 시작 시 호출하여 baseURL을 주입합니다.
 *
 * @param config - axios 설정 (baseURL 등)
 * @returns 초기화된 API 클라이언트 인스턴스
 */
export const initializeApiClient = (
  config?: CreateAxiosDefaults
): AxiosInstance => {
  apiClientInstance = createApiClient(config);
  return apiClientInstance;
};

/**
 * 기본 API 클라이언트 인스턴스
 * 각 앱에서 interceptors를 추가하여 사용하세요.
 * 초기화되지 않았으면 에러 발생생
 */
export const apiClient = (<T = unknown>(
  ...args: Parameters<AxiosInstance>
): ReturnType<AxiosInstance> => {
  if (!apiClientInstance) {
    throw new Error(
      'API client is not initialized. Please call initializeApiClient() in your app config.'
    );
  }

  return apiClientInstance<T>(...args);
}) as AxiosInstance;
