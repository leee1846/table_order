/* eslint-disable @typescript-eslint/no-explicit-any */
import { Capacitor, registerPlugin, type Plugin } from '@capacitor/core';
export interface AlbumPhoto {
  thumbPath: string; // 썸네일 웹뷰 URL (http://)
  path: string; // 원본 파일 URI (업로드용)
}

//실제 네이티브 플러그인 인터페이스
interface INativeCamera {
  // Native now returns only the file path; web side derives the webview-safe URL.
  takePhoto(): Promise<{ path: string }>;
  closeCamera(): Promise<void>;
  pickImageFromGallery(): Promise<{ paths: string[] }>;
  loadAlbumImages(options: {
    page: number;
    limit: number;
  }): Promise<{ images: any[] }>;
  prepareOriginalFile(options: { uri: string }): Promise<{ path: string }>;
  clearImageCache(): Promise<void>;
  scanQR(): Promise<{ content: string }>;
}

//커스텀
export interface ICameraManager {
  takePhoto(): Promise<{ src: string; originalPath: string } | null>;
  closeCamera(): Promise<void>;
  pickImages(): Promise<string[]>;
  pickPhoto(): Promise<{ src: string; originalPath: string } | null>;
  loadAlbum(page?: number, limit?: number): Promise<AlbumPhoto[]>;
  getOriginalFile(originalUri: string): Promise<string | null>;
  clearCache(): Promise<void>;
  scanQR(): Promise<string | null>;
}

const NativeCamera = registerPlugin<INativeCamera & Plugin>('CameraManager');

/**
 * [CameraManager]
 * Custom Native Camera & Gallery Implementation
 * - @capacitor/camera 의존성 제거됨
 * - Native UI (CameraX) 및 System Gallery Intent 사용
 */
export const CameraManager: ICameraManager = {
  /**
   * [Custom] 카메라 촬영 (Native UI)
   * - 네이티브 카메라 뷰를 띄우고 사용자가 [확인]을 누를 때까지 대기합니다.
   * - [취소]를 누르면 null을 반환합니다.
   * @returns {Promise<{src: string, originalPath: string} | null>}
   */
  takePhoto: async () => {
    console.warn('[CameraManager.takePhoto] 요청');
    try {
      // [변경] startCamera -> takePhoto (Promise 대기)
      // Native에서 resolve될 때까지 여기서 멈춰있습니다.
      const result = await NativeCamera.takePhoto();

      // Native가 { path: "file://..." } 형태의 응답을 줍니다.
      const webPath = Capacitor.convertFileSrc(result.path);

      const out = {
        src: webPath, // <img src>용 http 경로
        originalPath: result.path, // 업로드용 file 경로
      };
      console.warn('[CameraManager.takePhoto] 반환:', out);
      return out;
    } catch (e: any) {
      // Native에서 reject("User cancelled") 처리 시 여기로 옴
      console.warn('[CameraManager.takePhoto] 반환: null (촬영 취소/에러)', e?.message ?? e, e);
      return null;
    }
  },

  /**
   * [Custom] 카메라 강제 종료
   * - 열려 있는 카메라 뷰를 닫습니다. (비상용/페이지 이탈용)
   */
  closeCamera: async () => {
    console.warn('[CameraManager.closeCamera] 요청');
    await NativeCamera.closeCamera();
    console.warn('[CameraManager.closeCamera] 반환: void');
  },

  /**
   * [Custom] 갤러리 다중 선택 (Picker)
   * - 안드로이드 기본 갤러리/구글포토를 호출합니다.
   * @returns {Promise<string[]>} 웹뷰용 이미지 경로 배열
   */
  pickImages: async () => {
    console.warn('[CameraManager.pickImages] 요청');
    try {
      const result = await NativeCamera.pickImageFromGallery();
      const paths = result.paths || [];

      // file:// -> http:// 변환
      const out = paths.map((path: string) => Capacitor.convertFileSrc(path));
      console.warn('[CameraManager.pickImages] 반환:', out);
      return out;
    } catch (e) {
      console.warn('[CameraManager.pickImages] 반환: [] (갤러리 선택 취소/에러)', e);
      return [];
    }
  },

  /**
   * [Legacy] 갤러리 단일 선택
   * - pickImages를 재사용하여 첫 번째 이미지만 반환
   */
  pickPhoto: async () => {
    console.warn('[CameraManager.pickPhoto] 요청');
    const images = await CameraManager.pickImages();
    if (images.length > 0) {
      const firstImage = images[0];
      if (firstImage) {
        const out = { src: firstImage, originalPath: firstImage };
        console.warn('[CameraManager.pickPhoto] 반환:', out);
        return out;
      }
    }
    console.warn('[CameraManager.pickPhoto] 반환: null');
    return null;
  },

  /**
   * [Custom] 커스텀 앨범 데이터 로드 (Paging)
   * @param {number} page
   * @param {number} limit
   */
  loadAlbum: async (page = 0, limit = 20) => {
    console.warn('[CameraManager.loadAlbum] 요청:', { page, limit });
    try {
      const result = await NativeCamera.loadAlbumImages({ page, limit });

      const out = (result.images || []).map((img: any) => ({
        ...img,
        thumbPath: Capacitor.convertFileSrc(img.thumbPath),
      }));
      console.warn('[CameraManager.loadAlbum] 반환:', out);
      return out;
    } catch (e) {
      console.warn('[CameraManager.loadAlbum] 반환: [] (앨범 로드 실패)', e);
      return [];
    }
  },

  /**
   * [Upload] 앨범 원본 파일 준비
   * content:// URI를 file:// 경로로 변환하여 복사
   */
  getOriginalFile: async (originalUri: string) => {
    console.warn('[CameraManager.getOriginalFile] 요청:', { originalUri });
    try {
      const res = await NativeCamera.prepareOriginalFile({ uri: originalUri });

      const out = Capacitor.convertFileSrc(res.path);
      console.warn('[CameraManager.getOriginalFile] 반환:', out);
      return out;
    } catch (e) {
      console.warn('[CameraManager.getOriginalFile] 반환: null (원본 준비 실패)', e);
      return null;
    }
  },

  /**
   * 캐시 삭제
   */
  clearCache: async () => {
    console.warn('[CameraManager.clearCache] 요청');
    await NativeCamera.clearImageCache();
    console.warn('[CameraManager.clearCache] 반환: void');
  },

  /**
   * QR 코드 스캔
   * - 카메라를 켜고 QR 코드를 인식하면 내용을 반환하고 종료합니다.
   * @returns {Promise<string | null>} QR 내용 (실패/취소 시 null)
   */
  scanQR: async (): Promise<string | null> => {
    console.warn('[CameraManager.scanQR] 요청');
    try {
      // { content: "http://..." } 형태의 응답
      const result = await NativeCamera.scanQR();
      console.warn('[CameraManager.scanQR] 반환:', result.content);
      return result.content;
    } catch (e) {
      console.warn('[CameraManager.scanQR] 반환: null (에러)', e);
      return null;
    }
  },
};
