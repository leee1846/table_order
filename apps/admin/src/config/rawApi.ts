import { createAxiosInstance } from '@repo/api/cores';
import { REQUEST_TIMEOUT_MS } from '@/constants/common';

/**
 * 아무 인증 없이 요청하고싶을때 사용
 * interceptor 없이 요청하고싶을때 사용
 * rawApi는 토큰 리프레시 요청에 사용됨
 */
export const rawApi = createAxiosInstance({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
});
