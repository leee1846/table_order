import { useEffect } from 'react';
import { CapacitorApp } from '@repo/util/app';

declare const __APP_VERSION__: string;

const IDLE_INTERVAL_MS = 5 * 60 * 1000; // 5분

/**
 * 네이티브 앱에서만 동작하는 버전 체크 훅.
 *
 * - CapacitorApp.isNative()가 false면 아무 동작도 하지 않음.
 * - 마지막 터치 이후 5분이 지나면 /version.json을 fetch해 __APP_VERSION__과 비교.
 * - 버전이 다르면 window.location.replace()로 현재 URL을 캐시버스터와 함께 다시 로드 (웹뷰 메모리 스파이크 방지).
 * - 터치가 발생할 때마다 5분 카운트가 리셋되므로, 사용 중에는 체크하지 않음.
 * - 네트워크 오류 시 무시하고 다음 주기에 재시도.
 *
 * 사전 조건: vite.config에 __APP_VERSION__ 주입, 빌드 시 /version.json 생성.
 */
export const useAppVersionCheck = () => {
  useEffect(() => {
    if (!CapacitorApp.isNative()) {
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const checkVersion = async () => {
      try {
        const response = await fetch(`/version.json?t=${Date.now()}`, {
          cache: 'no-store',
        });

        if (!response.ok) {
          return;
        }

        const { version } = (await response.json()) as { version: string };
        if (!version || version === __APP_VERSION__) {
          return;
        }

        const url = new URL(window.location.href);
        url.searchParams.set('_t', String(Date.now()));
        window.location.replace(url.toString());
      } catch {
        // 네트워크 오류 시 다음 주기(5분 후)에 재시도
      }
    };

    const scheduleNext = () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(async () => {
        timeoutId = null;
        await checkVersion();
        scheduleNext();
      }, IDLE_INTERVAL_MS);
    };

    const onTouch = () => {
      scheduleNext();
    };

    scheduleNext();
    document.addEventListener('touchstart', onTouch, { passive: true });

    return () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      document.removeEventListener('touchstart', onTouch);
    };
  }, []);
};
