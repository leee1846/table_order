import { registerPlugin, type Plugin } from '@capacitor/core';

interface INativeUpdater extends Plugin {
  downloadAndInstall(params: { url: string; timeStamp?: string }): Promise<void>;
}

const NativeUpdater = registerPlugin<INativeUpdater>('Updater');

export interface IUpdater {
  /**
   * APK 다운로드 및 무음 설치 시작
   * - 백그라운드에서 다운로드 후, 해시 검증을 통과하면 즉시 설치합니다.
   * @param url - APK 다운로드 URL (필수)
   * @returns 설치 세션이 커밋되면 resolve됩니다.
   */
  startUpdate(url: string): Promise<void>;
}

export const Updater: IUpdater = {
  startUpdate: async (url: string): Promise<void> => {
    if (!url) throw new Error('APK URL is required');
    
    // 고유한 값 생성: timestamp + UUID 조합
    const timestamp = Date.now();
    const uuid = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    const uniqueValue = `${timestamp}-${uuid}`;
    
    return NativeUpdater.downloadAndInstall({ url, timeStamp: uniqueValue });
  },
};
