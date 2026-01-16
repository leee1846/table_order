import { AndroidInfo, CapacitorApp } from '@repo/util/app';
import { openConfirmDialog } from '@repo/feature/utils';
import type { TFunction } from 'i18next';

export interface DeviceInfo {
  ipAddress: string;
  androidId: string;
  appInfo: {
    version: string;
    build: string;
  };
}

interface GetDeviceInfoOptions {
  /** 
   * i18n 번역 함수
   * 다이얼로그 메시지 번역에 사용
   */
  t: TFunction;
  
  /**
   * androidId만 필요한 경우 true
   * @default false
   */
  androidIdOnly?: boolean;
}

/**
 * 디바이스 정보를 가져옵니다.
 * - IP 주소, Android ID, 앱 정보(버전, 빌드번호)를 조회
 * - 실패 시 사용자에게 다이얼로그를 표시하고 재시도
 * - 모든 정보를 성공적으로 가져올 때까지 반복
 * 
 * @param options - 옵션 객체
 * @returns 디바이스 정보 객체
 * 
 * @example
 * ```ts
 * // 모든 정보 가져오기
 * const deviceInfo = await getDeviceInfo({ t });
 * 
 * // androidId만 가져오기
 * const { androidId } = await getDeviceInfo({ t, androidIdOnly: true });
 * ```
 */
export const getDeviceInfo = async (
  options: GetDeviceInfoOptions
): Promise<DeviceInfo> => {
  const { t, androidIdOnly = false } = options;

  let ipAddress: string | null = null;
  let androidId: string | null = null;
  let appInfo: Awaited<ReturnType<typeof CapacitorApp.getInfo>> | null = null;

  // androidIdOnly 모드: androidId만 가져오기
  if (androidIdOnly) {
    while (!androidId) {
      androidId = await AndroidInfo.getId();

      if (!androidId) {
        await showRetryDialog(t);
      }
    }

    // androidId만 필요한 경우 나머지는 빈 값으로 반환
    return {
      ipAddress: '',
      androidId,
      appInfo: { version: '', build: '' },
    };
  }

  // 전체 정보 가져오기: 모두 성공할 때까지 반복
  while (!ipAddress || !androidId || !appInfo) {
    try {
      // 3개 모두 병렬 요청
      [ipAddress, androidId, appInfo] = await Promise.all([
        AndroidInfo.getIp(),
        AndroidInfo.getId(),
        CapacitorApp.getInfo(),
      ]);

      // 1개라도 실패하면 다이얼로그 표시 후 재시도
      if (!ipAddress || !androidId || !appInfo) {
        await showRetryDialog(t);
      }
    } catch (_error) {
      // 예외 발생 시에도 다이얼로그 표시 후 재시도
      await showRetryDialog(t);
    }
  }

  return {
    ipAddress,
    androidId,
    appInfo: {
      version: appInfo.version ?? '',
      build: appInfo.build ?? '',
    },
  };
};

/**
 * 재시도 다이얼로그를 표시합니다.
 * 사용자가 확인 버튼을 누를 때까지 대기
 */
const showRetryDialog = (t: TFunction): Promise<void> => {
  return new Promise<void>((resolve) => {
    openConfirmDialog({
      title: t('오류'),
      content: t('디바이스 정보를 가져오는데 실패했습니다. 다시 시도해주세요.'),
      confirmText: t('확인'),
      onConfirm: resolve,
    });
  });
};
