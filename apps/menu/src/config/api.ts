import { apiClient } from '@repo/api';
import type {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';

/**
 * API 클라이언트 설정 예시
 * 이 파일에서 앱별 axios interceptor를 설정합니다.
 */

// Request Interceptor - 토큰 추가 등
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 로컬 스토리지나 쿠키에서 토큰 가져오기?
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
