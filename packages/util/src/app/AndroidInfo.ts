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
    try {
      const res = await NativeInfo.getIpAddress();
      return res.ip;
    } catch {
      return null;
    }
  },

  getMac: async () => {
    try {
      const res = await NativeInfo.getMacAddress();
      return res.mac;
    } catch {
      return null;
    }
  },

  getId: async () => {
    try {
      const res = await NativeInfo.getAndroidId();
      return res.uuid;
    } catch {
      return null;
    }
  },
};
