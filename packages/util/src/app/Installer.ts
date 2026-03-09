import { registerPlugin, type Plugin } from '@capacitor/core';

interface INativeInstaller extends Plugin {
  downloadAndInstall(params: { url: string; checksum?: string }): Promise<void>;
  installExternalApk(params: {
    url: string;
    checksum?: string;
    silent?: boolean;
  }): Promise<void>;
}

const NativeInstaller = registerPlugin<INativeInstaller>('Installer');

export interface IInstaller {
  /**
   * APK 다운로드 및 무음 설치 시작
   * - 백그라운드에서 다운로드 후, 해시 검증을 통과하면 즉시 설치합니다.
   * @param url - APK 다운로드 URL (필수)
   * @param checksum - 파일 무결성 검증용 SHA-256 해시값 (필수)
   * @returns 설치 세션이 커밋되면 resolve됩니다.
   */
  startUpdate(url: string, checksum: string): Promise<void>;
}

export const Installer: IInstaller = {
  startUpdate: async (url: string, checksum: string): Promise<void> => {
    if (!url) throw new Error('APK URL is required');

    return await NativeInstaller.downloadAndInstall({ url, checksum });
  },
};
