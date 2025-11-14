import { initializeApiClient } from '@repo/api';
import type {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from '@repo/api/axios';

// API 클라이언트 초기화 (baseURL 주입)
const apiClient = initializeApiClient({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Request Interceptor - 토큰 추가 등
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - 에러 처리 등
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export { apiClient };
