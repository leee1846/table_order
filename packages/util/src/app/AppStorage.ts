import { registerPlugin, type Plugin } from '@capacitor/core';
import { saveAppLog } from './AppLog';

export interface IAppStorage {
  /**
   * 데이터 저장
   * @param options.key - 고유 키
   * @param options.value - 저장할 값 (문자열, 숫자, JSON 객체 모두 가능)
   * @param options.isTemporary - true면 앱 종료 시 삭제(RAM), false면 영구 저장(Disk)
   */
  saveData(options: {
    key: string;
    value: unknown;
    isTemporary?: boolean;
  }): Promise<void>;

  /**
   * 데이터 로드
   * @param options.key - 고유 키
   * @returns 저장된 값 (없으면 null)
   */
  loadData<T = unknown>(options: { key: string }): Promise<{ value: T | null }>;

  /**
   * 특정 키 데이터 삭제 (영구/임시 모두)
   * @param options.key - 고유 키
   */
  removeData(options: { key: string }): Promise<void>;

  /**
   * 모든 데이터 초기화 (영구/임시 모두 삭제)
   */
  removeAllData(): Promise<void>;

  /**
   * 모든 데이터 로드
   * @returns 영구 저장 데이터와 임시 저장 데이터
   */
  getAllData(): Promise<{
    permanent: Record<string, unknown>;
    temporary: Record<string, unknown>;
  }>;

  /**
   * 파일 존재 확인
   * @param options.key - 데이터 키 (type이 'data'일 때)
   * @param options.fileName - 파일명 (type이 'image'/'video'일 때)
   * @param options.type - 확인 타입
   * @returns 존재 여부
   */
  exists(options: {
    key?: string;
    fileName?: string;
    type?: 'data' | 'image' | 'video';
  }): Promise<{ exists: boolean }>;

  /**
   * 20MB 이하 Base64 문자열로 저장
   * @param options.fileName - 저장할 파일명 (예: 'sign.png')
   * @param options.base64Data - Base64 데이터 스트링
   * @param options.type - 'image' or 'video'
   */
  saveMedia(options: {
    fileName: string;
    base64Data: string;
    type?: 'image' | 'video';
  }): Promise<void>;

  /**
   * 20MB 이상 대용량 파일 다운로드
   * @param options.url - 다운로드할 URL
   * @param options.fileName - 저장할 파일명
   * @param options.type - 'image' or 'video'
   */
  downloadFromUrl(options: {
    url: string;
    fileName: string;
    type?: 'image' | 'video';
  }): Promise<void>;

  /**
   * 로컬 접근 URL 로드
   * @param options.fileName - 파일명
   * @param options.type - 'image' or 'video'
   * @returns 로컬 URL (예: http://localhost/_capacitor_file_/...)
   */
  getLocalUrl(options: {
    fileName: string;
    type?: 'image' | 'video';
  }): Promise<{ url: string }>;
}

const AppStorageNative = registerPlugin<IAppStorage & Plugin>('AppStorage');

/**
 * AppStorage
 * NativeStorage와 동일한 인터페이스를 구현합니다.
 */
export const AppStorage: IAppStorage = {
  saveData: async (options) => {
    const stringValue =
      typeof options.value === 'string'
        ? options.value
        : JSON.stringify(options.value);

    await AppStorageNative.saveData({
      ...options,
      value: stringValue,
    });
  },

  loadData: async <T = unknown>(options: { key: string }) => {
    const result = await AppStorageNative.loadData(options);
    const value = result.value as string | null;
    let out: { value: T | null };
    if (!value) {
      out = { value: null };
    } else {
      try {
        out = { value: JSON.parse(value) as T };
      } catch {
        out = { value: value as T };
      }
    }
    return out;
  },

  removeData: async (options) => {
    await AppStorageNative.removeData(options);
  },

  removeAllData: async () => {
    await AppStorageNative.removeAllData();
  },

  getAllData: async () => {
    const result = await AppStorageNative.getAllData();
    const parsedData: Record<string, unknown> = {};
    Object.entries(result.temporary).forEach(([key, value]) => {
      try {
        parsedData[key] = typeof value === 'string' ? JSON.parse(value) : value;
      } catch {
        parsedData[key] = value;
      }
    });
    saveAppLog('[앱스토리지 전체 조회]', { data: parsedData });
    return result;
  },

  exists: async (options) => {
    const result = await AppStorageNative.exists(options);
    return result;
  },

  saveMedia: async (options) => {
    await AppStorageNative.saveMedia(options);
  },

  downloadFromUrl: async (options) => {
    await AppStorageNative.downloadFromUrl(options);
  },

  getLocalUrl: async (options) => {
    const result = await AppStorageNative.getLocalUrl(options);
    return result;
  },
};
