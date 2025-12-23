import { registerPlugin, type Plugin } from '@capacitor/core';

interface AppStoragePlugin extends Plugin {
  saveData(options: { key: string; data: string }): Promise<void>;
  loadData(options: { key: string }): Promise<{ data: string | null }>;
  removeData(options: { key: string }): Promise<void>;
  saveMedia(options: {
    fileName: string;
    base64Data: string;
    type: 'image' | 'video';
  }): Promise<void>;
  downloadFromUrl(options: {
    url: string;
    fileName: string;
    type: 'image' | 'video';
  }): Promise<void>;
  getLocalUrl(options: {
    fileName: string;
    type: 'image' | 'video';
  }): Promise<{ url: string }>;
  exists(options: {
    fileName: string;
    type: 'image' | 'video';
  }): Promise<{ exists: boolean }>;
}

/**
 * 저장 타입 상수
 */
export const StorageType = {
  /** 영구 저장 */
  IMAGE: 'image' as const,
  /** 영구 저장 */
  VIDEO: 'video' as const,
  /** 임시 저장 (앱 종료 시 삭제) */
  DATA: 'data' as const,
} as const;

export type StorageTypeValue =
  | typeof StorageType.IMAGE
  | typeof StorageType.VIDEO
  | typeof StorageType.DATA;

const NativeStorage = registerPlugin<AppStoragePlugin>('AppStorage');

export const AppStorage = {
  /**
   * 데이터 저장
   * @param key - 파일명
   * @param data - 저장할 데이터 (string, number, boolean, null, object, array 등)
   */
  saveData: async (key: string, data: unknown): Promise<void> => {
    const stringData = typeof data === 'string' ? data : JSON.stringify(data);
    return NativeStorage.saveData({ key, data: stringData });
  },

  removeData: async (key: string): Promise<void> => {
    // TODO: 데이터 삭제 로직 추가 요청해야함
    return NativeStorage.removeData({ key });
  },

  /**
   * 데이터 로드
   * @param key - 파일명
   * @returns Promise<T | null>
   */
  loadData: async <T = Record<string, unknown>>(
    key: string
  ): Promise<T | null> => {
    const { data } = await NativeStorage.loadData({ key });
    return data ? (JSON.parse(data) as T) : null;
  },

  /**
   * 미디어 파일 저장
   * @param fileName - 파일명
   * @param base64Data - Base64 데이터 문자열
   * @param type - 'image' or 'video'
   */
  saveMedia: async (
    fileName: string,
    base64Data: string,
    type:
      | typeof StorageType.IMAGE
      | typeof StorageType.VIDEO = StorageType.IMAGE
  ): Promise<void> => {
    return NativeStorage.saveMedia({ fileName, base64Data, type });
  },

  /**
   * 20MB 이상 대용량 파일 다운로드
   * @param url - 다운로드 원본 url
   * @param fileName - 파일명
   * @param type - 'video' or 'image'
   */
  downloadFromUrl: async (
    url: string,
    fileName: string,
    type:
      | typeof StorageType.VIDEO
      | typeof StorageType.IMAGE = StorageType.VIDEO
  ): Promise<void> => {
    return NativeStorage.downloadFromUrl({ url, fileName, type });
  },

  /**
   * 로컬 미디어 URL 가져오기
   * @param fileName - 파일명
   * @param type - 'image' or 'video'
   */
  getLocalUrl: async (
    fileName: string,
    type:
      | typeof StorageType.IMAGE
      | typeof StorageType.VIDEO = StorageType.IMAGE
  ): Promise<string> => {
    const { url } = await NativeStorage.getLocalUrl({ fileName, type });
    return url;
  },

  /**
   * 파일 존재 여부 확인
   * @param fileName - 파일명
   * @param type - 'image' or 'video'
   */
  exists: async (
    fileName: string,
    type:
      | typeof StorageType.IMAGE
      | typeof StorageType.VIDEO = StorageType.IMAGE
  ): Promise<boolean> => {
    const { exists } = await NativeStorage.exists({ fileName, type });
    return exists;
  },
};
