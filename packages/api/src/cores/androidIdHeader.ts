import type { InternalAxiosRequestConfig } from 'axios';
import { AndroidInfo, CapacitorApp } from '@repo/util/app';

export const ANDROID_ID_HEADER = 'X-Android-Id';

let cachedAndroidId: string | null = null;
let inflightAndroidIdRequest: Promise<string | null> | null = null;

/**
 * 캐시된 Android ID를 비웁니다. 다음 API 요청 시 브릿지에서 다시 조회합니다.
 */
export const clearCachedAndroidId = (): void => {
  cachedAndroidId = null;
};

async function fetchAndroidId(): Promise<string | null> {
  try {
    const androidId = await AndroidInfo.getId();
    return androidId ?? null;
  } catch {
    return null;
  }
}

/**
 * 네이티브 앱에서 API 헤더에 넣을 Android ID를 반환합니다.
 * - 웹/비네이티브: null (브릿지 호출 없음)
 * - 조회 중: 동시 요청은 동일 Promise를 await
 * - 조회 실패/빈 값: null (요청은 계속 진행, null은 캐시하지 않음)
 * - 조회 성공: 메모리 캐시 후 재사용
 */
export async function resolveAndroidIdForHeader(): Promise<string | null> {
  if (!CapacitorApp.isNative()) {
    return null;
  }

  if (cachedAndroidId) {
    return cachedAndroidId;
  }

  if (!inflightAndroidIdRequest) {
    inflightAndroidIdRequest = fetchAndroidId()
      .then((androidId) => {
        if (androidId) {
          cachedAndroidId = androidId;
        }
        return androidId;
      })
      .finally(() => {
        inflightAndroidIdRequest = null;
      });
  }

  return inflightAndroidIdRequest;
}

export function applyAndroidIdRequestHeader(
  config: InternalAxiosRequestConfig,
  androidId: string | null
): void {
  if (!androidId) {
    return;
  }

  if (typeof config.headers.set === 'function') {
    config.headers.set(ANDROID_ID_HEADER, androidId);
    return;
  }

  config.headers[ANDROID_ID_HEADER] = androidId;
}
