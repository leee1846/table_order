import { App } from '@capacitor/app';

export interface ICapacitorApp {
  getInfo(): Promise<{
    name: string;
    id: string;
    build: string;
    version: string;
  }>;
}

export const CapacitorApp: ICapacitorApp = {
  getInfo: async () => {
    return App.getInfo();
  },
};
