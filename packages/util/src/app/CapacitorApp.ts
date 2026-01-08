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
    try {
      const res = await App.getInfo();
      return res;
    } catch {
      return null;
    }
  },
  isNative: () => {
    return Capacitor.isNativePlatform();
  },
};
