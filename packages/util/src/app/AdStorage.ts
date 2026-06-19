import { registerPlugin, type Plugin } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';

export interface AdStorageDownloadAdResult {
  success: boolean;
  path: string;
  skipped: boolean;
}

export interface AdStorageFileInfo {
  fileName: string;
  size: number;
}

export interface AdStorageListAdsResult {
  files: AdStorageFileInfo[];
}

export interface AdStorageGetAdUrlResult {
  url: string;
}

export interface AdStorageDeleteAdResult {
  success: boolean;
}

export interface AdStorageClearAdsResult {
  success: boolean;
  deletedCount: number;
}

export interface IAdStorage {
  /**
   * 광고 파일 다운로드
   * @param options.overwrite - true면 기존 파일이 있어도 다시 다운로드
   * @returns skipped - 파일이 이미 있어 다운로드를 건너뛴 경우 true
   */
  downloadAd(options: {
    url: string;
    fileName: string;
    overwrite: boolean;
  }): Promise<AdStorageDownloadAdResult>;

  /** 저장된 광고 파일 목록 */
  listAds(): Promise<AdStorageListAdsResult>;

  /** 로컬 광고 파일 접근 URL */
  getAdUrl(options: { fileName: string }): Promise<AdStorageGetAdUrlResult>;

  deleteAd(options: { fileName: string }): Promise<AdStorageDeleteAdResult>;

  clearAds(): Promise<AdStorageClearAdsResult>;
}

const AdStorageNative = registerPlugin<IAdStorage & Plugin>('AdStorage');

/**
 * AdStorage — 네이티브 광고 전용 스토리지 플러그인
 */
export const AdStorage: IAdStorage = {
  downloadAd: (options) => AdStorageNative.downloadAd(options),
  listAds: () => AdStorageNative.listAds(),
  getAdUrl: (options) => AdStorageNative.getAdUrl(options),
  deleteAd: (options) => AdStorageNative.deleteAd(options),
  clearAds: () => AdStorageNative.clearAds(),
};

/** 네이티브 광고 파일이 저장되는 External 하위 디렉터리 */
const AD_STORAGE_DIR = 'sks_ads';

const base64ToBlob = (base64: string, type: string): Blob => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type });
};

const videoMimeFromName = (fileName: string): string =>
  fileName.toLowerCase().endsWith('.mp4') ? 'video/mp4' : 'video/webm';

/**
 * 광고 영상을 Filesystem으로 직접 읽어 Blob URL로 반환한다.
 *
 * `_capacitor_file_` 로컬 HTTP 서버로 영상을 스트리밍하면 Range 요청 처리 문제로
 * `FFmpegDemuxer: data source error`(net::ERR_FAILED)가 발생해 재생이 끊긴다.
 * 파일 전체를 메모리로 읽어 Blob URL로 제공하면 HTTP 서버·Range 경로를 우회한다.
 *
 * 읽기 실패 시 null을 반환하므로, 호출부에서 기존 getAdUrl로 안전하게 폴백할 수 있다.
 * 반환된 Blob URL은 더 이상 쓰지 않을 때 URL.revokeObjectURL로 해제해야 한다.
 */
export const getAdObjectUrl = async (
  fileName: string
): Promise<string | null> => {
  try {
    const { data } = await Filesystem.readFile({
      path: `${AD_STORAGE_DIR}/${fileName}`,
      directory: Directory.External,
    });
    if (typeof data !== 'string' || data.length === 0) {
      return null;
    }
    const blob = base64ToBlob(data, videoMimeFromName(fileName));
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
};
