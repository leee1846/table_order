import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

export interface ICapacitorApp {
  getInfo(): Promise<{
    name: string;
    id: string;
    build: string;
    version: string;
  }>;
  isNative(): boolean;
}

export const CapacitorApp: ICapacitorApp = {
  getInfo: async () => {
    return App.getInfo();
  },
  isNative: () => {
    return Capacitor.isNativePlatform();
  },
};
