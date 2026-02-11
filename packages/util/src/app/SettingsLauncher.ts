import { registerPlugin } from '@capacitor/core';

export type SettingsType = 'root' | 'wifi' | 'display' | 'date' | 'app_details';

interface SettingsLauncherPlugin {
  openSettings(options: { type: SettingsType }): Promise<void>;
}

const NativeSettings = registerPlugin<SettingsLauncherPlugin>('SettingsLauncher');

export interface ISettingsLauncher {
  /**
   * 네이티브 설정 화면 열기
   * @param type - 'root' | 'wifi' | 'display' | 'date' | 'app_details'
   */
  open(type?: SettingsType): Promise<void>;
}

export const SettingsLauncher: ISettingsLauncher = {
  open: async (type: SettingsType = 'root') => {
    return NativeSettings.openSettings({ type });
  },
};
