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

  /**
   * [External Install] 다른 앱 설치 (다운로드 -> 검증 -> 설치)
   * @param url - APK 다운로드 URL (필수)
   * @param silent - true: 몰래 설치 (시스템 권한 필요), false: 사용자 설치 팝업 띄우기
   */
  installExternal(url: string, silent?: boolean): Promise<void>;
}

export const Installer: IInstaller = {
  startUpdate: async (url: string, checksum: string): Promise<void> => {
    console.warn('[Installer.startUpdate] 요청:', { url, checksum });
    if (!url) throw new Error('APK URL is required');

    await NativeInstaller.downloadAndInstall({ url, checksum });
    console.warn('[Installer.startUpdate] 반환: void');
  },

  installExternal: async (
    url: string,
    silent: boolean = true
  ): Promise<void> => {
    console.warn('[Installer.installExternal] 요청:', { url, silent });
    if (!url) throw new Error('APK URL is required');

    // 고유한 값 생성: timestamp + UUID 조합
    const timestamp = Date.now();
    const uuid =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    const checksum = `${timestamp}-${uuid}`;

    // Java Method: installExternalApk
    await NativeInstaller.installExternalApk({ url, checksum, silent });
    console.warn('[Installer.installExternal] 반환: void');
  },
};
