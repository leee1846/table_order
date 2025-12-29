import { registerPlugin, type Plugin } from '@capacitor/core';

/**
 * 배터리/와이파이 상태 정보
 */
export interface SystemStatus {
  battery?: number;
  wifi?: number;
}

/**
 * SystemControlPlugin 인터페이스
 * Native와 SystemControl 모두 이 인터페이스를 공유합니다.
 */
export interface ISystemControl {
  /**
   * 상태 모니터링을 시작 (앱 시작 시 필수 호출)
   * - 배터리, 와이파이 신호 감지 리스너 등록
   * - 호출 즉시 현재 상태 이벤트를 1회 발송
   */
  startMonitoring(): Promise<SystemStatus>;

  /**
   * 상태 모니터링을 중지합니다.
   */
  stopMonitoring(): Promise<void>;

  /**
   * [이벤트 리스너] 상태 변화 감지 (배터리/와이파이)
   * @param callback - 콜백 함수
   * @returns Promise<PluginListenerHandle>
   *
   * 콜백 데이터 예시: { battery: 85, wifi: 3 }
   * - battery: 0 ~ 100 (%)
   * - wifi: 0 ~ 4 (신호 세기 레벨)
   */
  addListener(
    eventName: 'statusUpdate',
    callback: (info: SystemStatus) => void
  ): Promise<{ remove: () => Promise<void> }>;

  /**
   * 모든 리스너 제거
   */
  removeAllListeners(): Promise<void>;

  /**
   * 재부팅 (Device Owner 권한 필수)
   */
  reboot(): Promise<void>;

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
   * 앱 종료 (Process Kill).
   * 종료 전 키오스크 모드 해제
   */
  exitApp(): Promise<void>;

  /**
   * 웹뷰의 캐시, 쿠키, 로컬스토리지, 방문기록 삭제
   * (로그아웃 또는 초기화 시 사용)
   */
  clearWebData(): Promise<void>;

  /**
   * IPv4 주소 조회
   * @returns Promise<{ip: string}> 예: "192.168.0.10"
   */
  getIpAddress(): Promise<{ ip: string }>;

  /**
   * MAC 주소 조회
   * @returns Promise<{mac: string}> 예: "AA:BB:CC:DD:EE:FF"
   */
  getMacAddress(): Promise<{ mac: string }>;

  /**
   * 알림음 재생
   * @param options.type - 재생할 사운드 타입
   * - 'dingdong': 주문 알림
   * - 'siren': 경고/에러
   */
  playSound(options: { type: 'dingdong' | 'siren' }): Promise<void>;
}

const NativeSystem = registerPlugin<ISystemControl & Plugin>('SystemControl');

/**
 * SystemControl
 * NativeSystem과 동일한 인터페이스를 구현합니다.
 */
export const SystemControl: ISystemControl = {
  startMonitoring: async () => {
    NativeSystem.stopMonitoring();
    return NativeSystem.startMonitoring();
  },

  stopMonitoring: async () => {
    return NativeSystem.stopMonitoring();
  },

  addListener: async (eventName, callback) => {
    await NativeSystem.removeAllListeners();
    return NativeSystem.addListener(eventName, callback);
  },

  removeAllListeners: async () => {
    return NativeSystem.removeAllListeners();
  },

  reboot: async () => {
    return NativeSystem.reboot();
  },

  lockScreen: async () => {
    return NativeSystem.lockScreen();
  },

  wakeScreen: async () => {
    return NativeSystem.wakeScreen();
  },

  setBrightness: async (options) => {
    return NativeSystem.setBrightness(options);
  },

  startKiosk: async () => {
    return NativeSystem.startKiosk();
  },

  stopKiosk: async () => {
    return NativeSystem.stopKiosk();
  },

  exitApp: async () => {
    return NativeSystem.exitApp();
  },

  clearWebData: async () => {
    return NativeSystem.clearWebData();
  },

  getIpAddress: async () => {
    return NativeSystem.getIpAddress();
  },

  getMacAddress: async () => {
    return NativeSystem.getMacAddress();
  },

  playSound: async (options) => {
    return NativeSystem.playSound(options);
  },
};
