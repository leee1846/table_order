import { registerPlugin, type Plugin } from '@capacitor/core';

/**
 * 배터리/와이파이 상태 정보
 */
export interface SystemStatus {
  battery?: number | null;
  // - wifi 세기를 RSSI(dBm) 강도에서 0~4 레벨로 정규화
  // - Rssi 강도 범위 [ 최상(4): -55 이상, 좋음(3): -56 ~ -66, 보통(2): -67 ~ -77, 약함(1): -78 ~ -88, 연결 불가(0): -89 이하 ]
  wifi?: number | null; // 0~4 범위의 정규화된 값
  // - network_recovered: 네트워크 복구
  // - network_lost: 네트워크 끊김
  event?: 'network_recovered' | 'network_lost';
}

/**
 * RSSI(dBm) 값을 0~4 레벨로 정규화
 * @param rssi - RSSI 값 (dBm, 음수)
 * @returns 0~4 범위의 정규화된 값
 */
const normalizeRssiToLevel = (rssi: number): number => {
  if (rssi >= -55) {
    return 4; // 최상
  }
  if (rssi >= -66) {
    return 3; // 좋음
  }
  if (rssi >= -77) {
    return 2; // 보통
  }
  if (rssi >= -88) {
    return 1; // 약함
  }
  return 0; // 연결 불가
};

/**
 * SystemControlPlugin 인터페이스
 * Native와 SystemControl 모두 이 인터페이스를 공유합니다.
 */
export interface ISystemControl {
  /**
   * 상태 모니터링을 시작 (앱 시작 시 필수 호출)
   * - 배터리, 와이파이 신호 감지 리스너 등록
   * - 호출 즉시 현재 상태 이벤트를 1회 발송
   * [이벤트 리스너] 상태 변화 감지 (배터리/와이파이)
   */
  startMonitoring(callback: (status: SystemStatus) => void): Promise<void>;

  /**
   * 상태 모니터링을 중지합니다.
   */
  stopMonitoring(): Promise<void>;

  /**
   * 재부팅 (Device Owner 권한 필수)
   */
  reboot(): Promise<void>;

  /**
   * 앱 재시작 (네트워크 오류 복구 시 사용)
   * - 프로세스를 완전히 종료하고 다시 켭니다.
   */
  restartApp(): Promise<void>;

  /**
   * 화면 잠금 (화면 끄기)
   */
  lockScreen(): Promise<void>;

  /**
   * 화면 켜기
   * 잠금화면이 설정되어 있어도 무시
   */
  wakeScreen(): Promise<void>;

  /**
   * 화면 밝기 조절
   * @param options.value - 0.0 (어두움) ~ 1.0 (최대 밝기)
   */
  setBrightness(options: { value: number }): Promise<void>;

  /**
   * 키오스크 모드 시작 (홈버튼, 뒤로가기, 상태바 잠금)
   */
  startKiosk(): Promise<void>;

  /**
   * 키오스크 모드 해제
   */
  stopKiosk(): Promise<void>;

  /**
   * 디바이스 종료
   */
  shutdown(): Promise<void>;

  /**
   * 웹뷰의 캐시, 쿠키, 로컬스토리지, 방문기록 삭제
   * (로그아웃 또는 초기화 시 사용)
   */
  clearWebData(): Promise<void>;

  /**
   * 안전한 페이지 이동 (플러그인 연결 유지)
   * @param url
   */
  goToUrl(options: { url: string }): Promise<void>;

  /**
   * 알림음 재생
   * @param options.type - 재생할 사운드 타입
   * - 'dingdong': 주문 알림
   * - 'siren': 경고/에러
   */
  playSound(options: { type: 'dingdong' | 'siren' }): Promise<void>;

  /**
   * 앱 종료 (네이티브 전용)
   */
  exitApp(): Promise<void>;
}

const NativeSystem = registerPlugin<ISystemControl & Plugin>('SystemControl');

/**
 * SystemControl
 * NativeSystem과 동일한 인터페이스를 구현합니다.
 */
export const SystemControl: ISystemControl = {
  startMonitoring: async (callback) => {
    console.warn('[SystemControl.startMonitoring] 요청');
    NativeSystem.stopMonitoring();

    // RSSI 값을 0~4로 정규화하는 래퍼 콜백
    const normalizedCallback = (status: SystemStatus) => {
      const normalizedStatus: SystemStatus = {
        ...status,
        // wifi 값이 있으면 정규화
        wifi:
          status.wifi !== undefined && status.wifi !== null
            ? normalizeRssiToLevel(status.wifi)
            : null,
      };
      callback(normalizedStatus);
    };

    await NativeSystem.startMonitoring(normalizedCallback);
    console.warn('[SystemControl.startMonitoring] 반환: void');
  },

  stopMonitoring: async () => {
    console.warn('[SystemControl.stopMonitoring] 요청');
    await NativeSystem.stopMonitoring();
    console.warn('[SystemControl.stopMonitoring] 반환: void');
  },

  restartApp: async () => {
    console.warn('[SystemControl.restartApp] 요청');
    await NativeSystem.restartApp();
    console.warn('[SystemControl.restartApp] 반환: void');
  },

  reboot: async () => {
    console.warn('[SystemControl.reboot] 요청');
    await NativeSystem.reboot();
    console.warn('[SystemControl.reboot] 반환: void');
  },

  lockScreen: async () => {
    console.warn('[SystemControl.lockScreen] 요청');
    await NativeSystem.lockScreen();
    console.warn('[SystemControl.lockScreen] 반환: void');
  },

  wakeScreen: async () => {
    console.warn('[SystemControl.wakeScreen] 요청');
    await NativeSystem.wakeScreen();
    console.warn('[SystemControl.wakeScreen] 반환: void');
  },

  setBrightness: async (options) => {
    console.warn('[SystemControl.setBrightness] 요청:', options);
    await NativeSystem.setBrightness(options);
    console.warn('[SystemControl.setBrightness] 반환: void');
  },

  startKiosk: async () => {
    console.warn('[SystemControl.startKiosk] 요청');
    await NativeSystem.startKiosk();
    console.warn('[SystemControl.startKiosk] 반환: void');
  },

  stopKiosk: async () => {
    console.warn('[SystemControl.stopKiosk] 요청');
    await NativeSystem.stopKiosk();
    console.warn('[SystemControl.stopKiosk] 반환: void');
  },

  shutdown: async () => {
    console.warn('[SystemControl.shutdown] 요청');
    await NativeSystem.shutdown();
    console.warn('[SystemControl.shutdown] 반환: void');
  },

  clearWebData: async () => {
    console.warn('[SystemControl.clearWebData] 요청');
    await NativeSystem.clearWebData();
    console.warn('[SystemControl.clearWebData] 반환: void');
  },

  goToUrl: async (options: { url: string }) => {
    console.warn('[SystemControl.goToUrl] 요청:', options);
    await NativeSystem.goToUrl(options);
    console.warn('[SystemControl.goToUrl] 반환: void');
  },

  playSound: async (options) => {
    console.warn('[SystemControl.playSound] 요청:', options);
    await NativeSystem.playSound(options);
    console.warn('[SystemControl.playSound] 반환: void');
  },

  exitApp: async () => {
    console.warn('[SystemControl.exitApp] 요청');
    return NativeSystem.exitApp();
  },
};
