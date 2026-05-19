import { getAccessToken } from '@repo/api/auth';
import { ENDPOINTS } from '@repo/api/cores';
import { useSSE } from '@repo/feature/hooks';
import { SSE_KEYS } from '@/constants/keys';
import { AndroidInfo } from '@repo/util/app';

/**
 * SSE 연결을 초기화하거나 재연결
 */
export const initializeSseConnection = async () => {
  const androidId = await AndroidInfo.getId();

  if (!androidId) {
    return;
  }

  const accessToken = getAccessToken();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  if (!accessToken || !baseUrl) {
    return;
  }

  const url = `${baseUrl}${ENDPOINTS.SSE.CONNECT_DEVICE}?token=${accessToken}&androidId=${androidId}`;
  useSSE.connectSSE(SSE_KEYS.MAIN_CONNECTION, url);
};

/**
 * SSE 연결을 해제
 */
export const disconnectSse = (reason?: string) => {
  useSSE.disconnectSSE(SSE_KEYS.MAIN_CONNECTION, reason);
};

/**
 * 네트워크 복구 시 SSE 재연결 트리거
 */
export const reconnectSseOnNetworkRecovery = () => {
  useSSE.reconnectSSEOnNetworkRecovery(SSE_KEYS.MAIN_CONNECTION);
};
