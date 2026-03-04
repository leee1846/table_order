import type { AxiosError, AxiosResponse } from '@repo/api/axios';
import { createAxiosInstance } from '@repo/api/cores';

/**
 * 아무 인증 없이 요청하고싶을때 사용
 * interceptor 없이 요청하고싶을때 사용
 * rawApi는 토큰 리프레시 요청에 사용됨
 */
export const rawApi = createAxiosInstance({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

rawApi.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // app에서 로그 확인용
    if (!error.response) {
      console.error('rawApi interceptor error:', error);
    }
    return Promise.reject(error);
  }
);
