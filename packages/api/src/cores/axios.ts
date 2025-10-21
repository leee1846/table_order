import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios';

/**
 * 기본 axios 인스턴스를 생성합니다.
 * 각 앱에서 interceptors를 추가하여 커스터마이징할 수 있습니다.
 */
export const createApiClient = (
  config?: CreateAxiosDefaults
): AxiosInstance => {
  const instance = axios.create({
    baseURL:
      import.meta.env.VITE_API_BASE_URL ||
      'https://jsonplaceholder.typicode.com',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
  });

  return instance;
};

/**
 * 기본 API 클라이언트 인스턴스
 * 각 앱에서 interceptors를 추가하여 사용하세요.
 */
export const apiClient = createApiClient();
