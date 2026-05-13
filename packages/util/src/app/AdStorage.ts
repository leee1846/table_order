import { registerPlugin, type Plugin } from '@capacitor/core';

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
