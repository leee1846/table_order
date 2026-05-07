import { getAccessToken } from '@repo/api/auth';
import { ENDPOINTS } from '@repo/api/cores';
import { useSSE } from '@repo/feature/hooks';
import { SSE_KEYS } from '../constants/keys';
import adminI18n from '@/config/i18n/admin.i18n';
import { getDeviceInfo } from './deviceInfo';

/**
 * SSE 연결을 초기화하거나 재연결
 */
export const initializeSseConnection = async () => {
  const { androidId } = await getDeviceInfo({
    t: adminI18n.t,
    androidIdOnly: true,
  });

  const accessToken = getAccessToken();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // token이 없으면 기존 연결 해제
  if (!accessToken || !baseUrl) {
    return;
  }

  // SSE URL 생성
  const url = `${baseUrl}${ENDPOINTS.SSE.CONNECT_DEVICE}?token=${accessToken}&androidId=${androidId}`;
  useSSE.connectSSE(SSE_KEYS.MAIN_CONNECTION, url);
};

/**
 * SSE 연결을 해제
 */
export const disconnectSse = () => {
  useSSE.disconnectSSE(SSE_KEYS.MAIN_CONNECTION);
};

/**
 * 네트워크 복구 시 SSE 재연결 트리거
 */
export const reconnectSseOnNetworkRecovery = () => {
  useSSE.reconnectSSEOnNetworkRecovery(SSE_KEYS.MAIN_CONNECTION);
};
