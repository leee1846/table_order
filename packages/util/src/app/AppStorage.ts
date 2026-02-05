import { registerPlugin, type Plugin } from '@capacitor/core';

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
    console.warn('[AppStorage.saveData] 요청:', {
      key: options.key,
      isTemporary: options.isTemporary,
    });
    const stringValue =
      typeof options.value === 'string'
        ? options.value
        : JSON.stringify(options.value);

    await AppStorageNative.saveData({
      ...options,
      value: stringValue,
    });
    console.warn('[AppStorage.saveData] 반환: void');
  },

  loadData: async <T = unknown>(options: { key: string }) => {
    console.warn('[AppStorage.loadData] 요청:', options);
    const result = await AppStorageNative.loadData(options);
    const value = result.value as string | null;
    let out: { value: T | null };
    if (!value) {
      out = { value: null };
    } else {
      try {
        out = { value: JSON.parse(value) as T };
      } catch (e) {
        console.warn('[AppStorage.loadData] JSON 파싱 실패, 원본 반환', e);
        out = { value: value as T };
      }
    }
    console.warn('[AppStorage.loadData] 반환:', out);
    return out;
  },

  removeData: async (options) => {
    console.warn('[AppStorage.removeData] 요청:', options);
    await AppStorageNative.removeData(options);
    console.warn('[AppStorage.removeData] 반환: void');
  },

  removeAllData: async () => {
    console.warn('[AppStorage.removeAllData] 요청');
    await AppStorageNative.removeAllData();
    console.warn('[AppStorage.removeAllData] 반환: void');
  },

  getAllData: async () => {
    console.warn('[AppStorage.getAllData] 요청');
    const result = await AppStorageNative.getAllData();
    const parsedData: Record<string, unknown> = {};
    Object.entries(result.temporary).forEach(([key, value]) => {
      try {
        parsedData[key] = typeof value === 'string' ? JSON.parse(value) : value;
      } catch {
        parsedData[key] = value;
      }
    });
    console.warn('[AppStorage.getAllData] 반환:', parsedData);
    return result;
  },

  exists: async (options) => {
    console.warn('[AppStorage.exists] 요청:', options);
    const result = await AppStorageNative.exists(options);
    console.warn('[AppStorage.exists] 반환:', result);
    return result;
  },

  saveMedia: async (options) => {
    console.warn('[AppStorage.saveMedia] 요청:', {
      fileName: options.fileName,
      type: options.type,
    });
    await AppStorageNative.saveMedia(options);
    console.warn('[AppStorage.saveMedia] 반환: void');
  },

  downloadFromUrl: async (options) => {
    console.warn('[AppStorage.downloadFromUrl] 요청:', options);
    await AppStorageNative.downloadFromUrl(options);
    console.warn('[AppStorage.downloadFromUrl] 반환: void');
  },

  getLocalUrl: async (options) => {
    console.warn('[AppStorage.getLocalUrl] 요청:', options);
    const result = await AppStorageNative.getLocalUrl(options);
    console.warn('[AppStorage.getLocalUrl] 반환:', result);
    return result;
  },
};
