import { getAccessToken } from '@repo/api/auth';
import { ENDPOINTS } from '@repo/api/cores';
import { useSSE } from '@repo/feature/hooks';
import { SSE_KEYS } from '../constants/keys';
import { AndroidInfo } from '@repo/util/app';
import { openConfirmDialog } from '@repo/feature/utils';
import adminI18n from '@/config/i18n/admin.i18n';

/**
 * SSE 연결을 초기화하거나 재연결
 */
export const initializeSseConnection = async () => {
  let androidId: string | null = null;

  // 성공할 때까지 반복
  while (!androidId) {
    androidId = await AndroidInfo.getId();

    // 실패하면 다이얼로그 표시 후 재시도
    if (!androidId) {
      await new Promise<void>((resolve) => {
        openConfirmDialog({
          title: adminI18n.t('오류'),
          content: adminI18n.t(
            '디바이스 정보를 가져오는데 실패했습니다. 다시 시도해주세요.'
          ),
          confirmText: adminI18n.t('확인'),
          onConfirm: resolve,
        });
      });
    }
  }

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
