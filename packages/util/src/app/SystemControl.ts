import { registerPlugin, type Plugin } from '@capacitor/core';

/**
 * SystemControl 플러그인 인터페이스
 */
interface SystemControlPlugin extends Plugin {
  reboot(): Promise<void>;
  lockScreen(): Promise<void>;
  wakeScreen(): Promise<void>;
  startKiosk(): Promise<void>;
  exitApp(): Promise<void>;
  setBrightness(options: { value: number }): Promise<void>;
  removeAllListeners(): Promise<void>;
  addListener(
    eventName: 'statusUpdate',
    listenerFunc: (info: { battery: number; wifi: number }) => void
  ): Promise<{ remove: () => Promise<void> }>;
  startMonitoring(): Promise<void>;
}

/**
 * 배터리/와이파이 상태 정보
 */
export interface SystemStatus {
  battery: number;
  wifi: number;
}

/**
 * 상태 변화 콜백 함수 타입
 */
export type SystemStatusCallback = (status: SystemStatus) => void;

/**
 * 네이티브 플러그인 등록
 */
const NativeSystem = registerPlugin<SystemControlPlugin>('SystemControl');

/**
 * SystemControl 유틸리티
 * 시스템 제어 기능을 제공합니다.
 */
export const SystemControl = {
  /**
   * 기기 재부팅 (관리자 권한 필요)
   */
  reboot: async (): Promise<void> => {
    return NativeSystem.reboot();
  },

  /**
   * 화면 끄기
   */
  lockScreen: async (): Promise<void> => {
    return NativeSystem.lockScreen();
  },

  /**
   * 화면 켜기
   */
  wakeScreen: async (): Promise<void> => {
    return NativeSystem.wakeScreen();
  },

  /**
   * 상단바/하단바 숨김 및 뒤로가기/홈버튼 잠금
   */
  startKiosk: async (): Promise<void> => {
    return NativeSystem.startKiosk();
  },

  /**
   * 앱 종료
   */
  exitApp: async (): Promise<void> => {
    return NativeSystem.exitApp();
  },

  /**
   * 화면 밝기 조절
   * @param value - 0.0 (어두움) ~ 1.0 (밝음), -1.0 (default)
   */
  setBrightness: async (value: number): Promise<void> => {
    return NativeSystem.setBrightness({ value });
  },

  /**
   * 배터리/와이파이 상태 이벤트 모니터링
   * @param onStatus - 상태 변화 콜백 ({ battery: number, wifi: number })
   */
  initListeners: async (onStatus: SystemStatusCallback): Promise<void> => {
    // 기존 리스너 제거 (중복 방지)
    await NativeSystem.removeAllListeners();

    // 배터리/와이파이 리스너 등록
    if (onStatus) {
      NativeSystem.addListener('statusUpdate', (info) => {
        onStatus(info);
      });
    }

    // 모니터링 시작
    return NativeSystem.startMonitoring();
  },
};
