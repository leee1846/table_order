import { create } from '@repo/feature/zustand';
import type { IGetMenuAdFile, TGetMenuAdFilesAdType } from '@repo/api/types';
import { STORAGE_KEYS } from '@/constants/keys';
import { AppStorage } from '@repo/util/app';

const STANDBY_TYPES: readonly TGetMenuAdFilesAdType[] = [
  'STANDBY_VIDEO',
  'STANDBY_IMAGE',
];

const TOP_BANNER_TYPES: readonly TGetMenuAdFilesAdType[] = ['TOP_BANNER_IMAGE'];

const ORDER_COMP_FULL_TYPES: readonly TGetMenuAdFilesAdType[] = [
  'ORDER_COMP_FULL_VIDEO',
  'ORDER_COMP_FULL_IMAGE',
];

const ORDER_COMP_SIDE_TYPES: readonly TGetMenuAdFilesAdType[] = [
  'ORDER_COMP_SIDE_IMAGE',
];

export interface IAdStoreData {
  /** 전면 대기 광고 (STANDBY_VIDEO, STANDBY_IMAGE) */
  standbyFiles: IGetMenuAdFile[];
  /** 상단 배너 광고 (TOP_BANNER_IMAGE) */
  topBannerFiles: IGetMenuAdFile[];
  /** 주문 완료 전면 광고 (ORDER_COMP_FULL_VIDEO, ORDER_COMP_FULL_IMAGE) */
  orderCompleteFullFiles: IGetMenuAdFile[];
  /** 주문 완료 사이드 광고 (ORDER_COMP_SIDE_IMAGE) */
  orderCompleteSideFiles: IGetMenuAdFile[];
  /** 다운로드된 영상 로컬 URL 맵 — fileName → localUrl */
  localVideoUrls: Record<string, string>;
  /** 초기 로드(API 응답 or AppStorage 복원) 완료 여부 */
  isLoaded: boolean;
  /** 영상 다운로드를 포함한 전체 광고 데이터 준비 완료 여부 */
  isAdDataLoading: boolean;
}

interface IAdStore {
  data: IAdStoreData;
  /**
   * API 응답 전체를 받아 adType별로 그룹화하고 AppStorage에 세션 캐시
   */
  setAdFiles: (files: IGetMenuAdFile[]) => Promise<void>;
  /**
   * 영상 다운로드 완료 후 로컬 URL 등록
   */
  setLocalVideoUrl: (fileName: string, url: string) => void;
  /**
   * 영상 다운로드를 포함한 전체 처리 완료 여부를 갱신
   */
  setAdDataLoading: (loading: boolean) => void;
  clearData: () => void;
}

// ============================================================================
// 내부 유틸
// ============================================================================

const sortByOrder = (files: IGetMenuAdFile[]) =>
  [...files].sort((a, b) => a.sortOrder - b.sortOrder);

const groupAdFiles = (
  files: IGetMenuAdFile[]
): Pick<
  IAdStoreData,
  | 'standbyFiles'
  | 'topBannerFiles'
  | 'orderCompleteFullFiles'
  | 'orderCompleteSideFiles'
> => ({
  standbyFiles: sortByOrder(
    files.filter((f) => (STANDBY_TYPES as string[]).includes(f.adType))
  ),
  topBannerFiles: sortByOrder(
    files.filter((f) => (TOP_BANNER_TYPES as string[]).includes(f.adType))
  ),
  orderCompleteFullFiles: sortByOrder(
    files.filter((f) => (ORDER_COMP_FULL_TYPES as string[]).includes(f.adType))
  ),
  orderCompleteSideFiles: sortByOrder(
    files.filter((f) => (ORDER_COMP_SIDE_TYPES as string[]).includes(f.adType))
  ),
});

const INITIAL_DATA: IAdStoreData = {
  standbyFiles: [],
  topBannerFiles: [],
  orderCompleteFullFiles: [],
  orderCompleteSideFiles: [],
  localVideoUrls: {},
  isLoaded: false,
  isAdDataLoading: true,
};

// ============================================================================
// Store
// ============================================================================

/**
 * 광고 파일 데이터를 관리하는 Zustand 스토어
 *
 * @description
 * - API 응답(IGetMenuAdFile[])을 adType별로 그룹화하여 보관
 * - 영상 파일의 로컬 URL(AppStorage.getLocalUrl 결과)을 localVideoUrls에 캐시
 * - 메타데이터는 AppStorage(temporary)에 세션 캐시하여 앱 재기동 시 빠르게 복원
 */
export const useAdStore = create<IAdStore>((set) => {
  // 세션 캐시 복원 (앱 재기동 시 API 응답 전에 이전 데이터로 즉시 렌더 가능)
  // isLoaded가 이미 true이면 API가 먼저 응답한 것이므로 캐시로 덮어쓰지 않음
  AppStorage.loadData<IGetMenuAdFile[]>({ key: STORAGE_KEYS.AD_FILES }).then(
    (result) => {
      if (!result?.value?.length) {
        return;
      }

      set((state) => {
        if (state.data.isLoaded) {
          return state;
        }

        return {
          data: {
            ...state.data,
            ...groupAdFiles(result.value!),
            isLoaded: true,
          },
        };
      });
    }
  );

  return {
    data: INITIAL_DATA,

    setAdFiles: async (files) => {
      set((state) => ({
        data: {
          ...state.data,
          ...groupAdFiles(files),
          isLoaded: true,
        },
      }));
      await AppStorage.saveData({
        key: STORAGE_KEYS.AD_FILES,
        value: files,
        isTemporary: true,
      });
    },

    setLocalVideoUrl: (fileName, url) => {
      set((state) => ({
        data: {
          ...state.data,
          localVideoUrls: {
            ...state.data.localVideoUrls,
            [fileName]: url,
          },
        },
      }));
    },

    setAdDataLoading: (loading) => {
      set((state) => ({
        data: { ...state.data, isAdDataLoading: loading },
      }));
    },

    clearData: () => {
      AppStorage.removeData({ key: STORAGE_KEYS.AD_FILES });
      set({ data: INITIAL_DATA });
    },
  };
});
