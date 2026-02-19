import { useEffect } from 'react';

declare const __APP_VERSION__: string;

const VERSION_CHECK_INTERVAL = 5 * 60 * 1000; // 5분

/**
 * 배포된 버전과 현재 실행 중인 버전을 주기적으로 비교하여 자동 업데이트하는 훅
 *
 * @description
 * - 5분마다 /version.json을 fetch하여 현재 번들 버전(__APP_VERSION__)과 비교합니다
 * - 버전이 다르면 window.location.reload()를 호출하여 최신 버전을 적용합니다
 * - network 오류나 fetch 실패 시 무시하고 다음 주기에 재시도합니다
 *
 * 사전 조건:
 * - vite.config에 __APP_VERSION__ 전역 상수 주입 필요
 * - vite.config의 generateVersionJson 플러그인으로 빌드 시 /version.json 생성 필요
 */
export const useVersionCheck = () => {
  useEffect(() => {
    const checkVersion = async () => {
      try {
        const response = await fetch(`/version.json?t=${Date.now()}`, {
          cache: 'no-store',
        });

        if (!response.ok) {
          return;
        }

        const { version } = (await response.json()) as { version: string };

        if (version && version !== __APP_VERSION__) {
          window.location.reload();
        }
      } catch {
        // 네트워크 오류 시 무시하고 다음 주기에 재시도
      }
    };

    const interval = setInterval(checkVersion, VERSION_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, []);
};
