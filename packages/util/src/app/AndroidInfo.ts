import { registerPlugin, type Plugin } from '@capacitor/core';

interface INativeAndroidInfo {
  getIpAddress(): Promise<{ ip: string }>;
  getMacAddress(): Promise<{ mac: string }>;
  getAndroidId(): Promise<{ uuid: string }>;
}

export interface IAndroidInfo {
  /**
   * IPv4 주소 조회
   * @returns {Promise<string>} 예: "192.168.0.10"
   */
  getIp(): Promise<string | null>;

  /**
   * MAC 주소 조회 (Device Owner 권한 권장)
   * @returns {Promise<string>} 예: "AA:BB:CC:DD:EE:FF"
   */
  getMac(): Promise<string | null>;

  /**
   * Android ID (고유 식별자) 조회
   * @returns {Promise<string>}
   */
  getId(): Promise<string | null>;
}

const NativeInfo = registerPlugin<INativeAndroidInfo & Plugin>('AndroidInfo');

/**
 * AndroidInfo
 * NativeInfo와 동일한 인터페이스를 구현합니다.
 */
export const AndroidInfo: IAndroidInfo = {
  getIp: async () => {
    console.warn('[AndroidInfo.getIp] 요청');
    try {
      const res = await NativeInfo.getIpAddress();
      console.warn('[AndroidInfo.getIp] 반환:', res.ip);
      return res.ip;
    } catch (e) {
      console.warn('[AndroidInfo.getIp] 반환: null (에러)', e);
      return null;
    }
  },

  getMac: async () => {
    console.warn('[AndroidInfo.getMac] 요청');
    try {
      const res = await NativeInfo.getMacAddress();
      console.warn('[AndroidInfo.getMac] 반환:', res.mac);
      return res.mac;
    } catch (e) {
      console.warn('[AndroidInfo.getMac] 반환: null (에러)', e);
      return null;
    }
  },

  getId: async () => {
    console.warn('[AndroidInfo.getId] 요청');
    try {
      const res = await NativeInfo.getAndroidId();
      console.warn('[AndroidInfo.getId] 반환:', res.uuid);
      return res.uuid;
    } catch (e) {
      console.warn('[AndroidInfo.getId] 반환: null (에러)', e);
      return null;
    }
  },
};
