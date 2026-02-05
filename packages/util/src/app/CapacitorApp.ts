import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

export interface ICapacitorApp {
  getInfo(): Promise<{
    name: string | null;
    id: string | null;
    build: string | null;
    version: string | null;
  } | null>;
  isNative(): boolean;
}

export const CapacitorApp: ICapacitorApp = {
  getInfo: async () => {
    console.warn('[CapacitorApp.getInfo] 요청');
    try {
      const res = await App.getInfo();
      console.warn('[CapacitorApp.getInfo] 반환:', res);
      return res;
    } catch (e) {
      console.warn('[CapacitorApp.getInfo] 반환: null (에러)', e);
      return null;
    }
  },
  isNative: () => {
    console.warn('[CapacitorApp.isNative] 요청');
    const out = Capacitor.isNativePlatform();
    console.warn('[CapacitorApp.isNative] 반환:', out);
    return out;
  },
};
