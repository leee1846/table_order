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
    try {
      // [변경] startCamera -> takePhoto (Promise 대기)
      // Native에서 resolve될 때까지 여기서 멈춰있습니다.
      const result = await NativeCamera.takePhoto();

      // Native가 { path: "file://..." } 형태의 응답을 줍니다.
      const webPath = Capacitor.convertFileSrc(result.path);

      return {
        src: webPath, // <img src>용 http 경로
        originalPath: result.path, // 업로드용 file 경로
      };
    } catch {
      // Native에서 reject("User cancelled") 처리 시 여기로 옴
      return null;
    }
  },

  /**
   * [Custom] 카메라 강제 종료
   * - 열려 있는 카메라 뷰를 닫습니다. (비상용/페이지 이탈용)
   */
  closeCamera: async () => {
    await NativeCamera.closeCamera();
  },

  /**
   * [Custom] 갤러리 다중 선택 (Picker)
   * - 안드로이드 기본 갤러리/구글포토를 호출합니다.
   * @returns {Promise<string[]>} 웹뷰용 이미지 경로 배열
   */
  pickImages: async () => {
    try {
      const result = await NativeCamera.pickImageFromGallery();
      const paths = result.paths || [];

      // file:// -> http:// 변환
      return paths.map((path: string) => Capacitor.convertFileSrc(path));
    } catch {
      return [];
    }
  },

  /**
   * [Legacy] 갤러리 단일 선택
   * - pickImages를 재사용하여 첫 번째 이미지만 반환
   */
  pickPhoto: async () => {
    const images = await CameraManager.pickImages();
    if (images.length > 0) {
      const firstImage = images[0];
      if (firstImage) {
        return { src: firstImage, originalPath: firstImage };
      }
    }
    return null;
  },

  /**
   * [Custom] 커스텀 앨범 데이터 로드 (Paging)
   * @param {number} page
   * @param {number} limit
   */
  loadAlbum: async (page = 0, limit = 20) => {
    try {
      const result = await NativeCamera.loadAlbumImages({ page, limit });

      return (result.images || []).map((img: any) => ({
        ...img,
        thumbPath: Capacitor.convertFileSrc(img.thumbPath),
      }));
    } catch {
      return [];
    }
  },

  /**
   * [Upload] 앨범 원본 파일 준비
   * content:// URI를 file:// 경로로 변환하여 복사
   */
  getOriginalFile: async (originalUri: string) => {
    try {
      const res = await NativeCamera.prepareOriginalFile({ uri: originalUri });
      return Capacitor.convertFileSrc(res.path);
    } catch {
      return null;
    }
  },

  /**
   * 캐시 삭제
   */
  clearCache: async () => {
    await NativeCamera.clearImageCache();
  },

  /**
   * QR 코드 스캔
   * - 카메라를 켜고 QR 코드를 인식하면 내용을 반환하고 종료합니다.
   * @returns {Promise<string | null>} QR 내용 (실패/취소 시 null)
   */
  scanQR: async (): Promise<string | null> => {
    try {
      // { content: "http://..." } 형태의 응답
      const result = await NativeCamera.scanQR();
      return result.content;
    } catch {
      return null;
    }
  },
};
