import { CapacitorApp } from './CapacitorApp';

/**
 * 네이티브 앱 환경에서만 구조화된 로그를 출력
 *
 * @param tag  - 로그 식별 태그
 *               (api_request / api_response / api_error /
 *                auth_expired / page_navigation / sse_error 등)
 * @param data - 함께 기록할 컨텍스트 데이터
 *
 * @example
 * saveAppLog('api_request', { method: 'POST', url: '/api/login' });
 * saveAppLog('auth_expired', { reason: 'token-expired' });
 * saveAppLog('page_navigation', { pathname: '/settings' });
 */
export const saveAppLog = (
  tag: string,
  data?: Record<string, unknown>
): void => {
  if (!CapacitorApp.isNative()) {
    return;
  }

  try {
    // eslint-disable-next-line no-console
    console.log(
      JSON.stringify({
        tag,
        ts: new Date().toISOString(),
        ...data,
      })
    );
  } catch {
    // eslint-disable-next-line no-console
    console.log(
      JSON.stringify({
        tag,
        ts: new Date().toISOString(),
        error: 'log_serialize_failed',
      })
    );
  }
};
