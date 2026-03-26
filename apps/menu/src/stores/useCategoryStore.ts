import { create } from '@repo/feature/zustand';
import type { ICategoryWithMenus } from '@repo/api/types';
import { STORAGE_KEYS } from '@/constants/keys';
import { AppStorage } from '@repo/util/app';
/**
 * 카테고리 요일/시간 기반의 노출여부 상태 관리
 * key: categorySeq, value: 카테고리가 현재 보이는지 여부
 */
export type ICategoryVisibilityMap = Record<number, boolean>;

export interface ICategoryStore {
  data: {
    /** 카테고리 목록 */
    categories: ICategoryWithMenus[] | null;
    /** 카테고리 노출여부 상태 맵  */
    visibilityMap: ICategoryVisibilityMap;
    /** 필터링된 보이는 카테고리 목록 (자동 계산) */
    visibleCategories: ICategoryWithMenus[];
  };

  /** 데이터 설정 (세션 스토리지에도 저장) */
  setCategoriesAsync: ({
    categories,
  }: {
    categories: ICategoryWithMenus[];
  }) => Promise<boolean>;
  /** 데이터 초기화 (세션 스토리지에서도 삭제) */
  clearData: () => void;

  /** 모든 카테고리 노출여부 상태 맵 업데이트 */
  updateAllVisibility: (visibilityMap: ICategoryVisibilityMap) => void;
}

const computeVisibleCategories = (
  categories: ICategoryWithMenus[] | null,
  visibilityMap: ICategoryVisibilityMap
): ICategoryWithMenus[] => {
  if (!categories) {
    return [];
  }

  return categories.filter((category: ICategoryWithMenus) => {
    // isHidden이 true이면 숨김
    if (category.isHidden) {
      return false;
    }
    // visibilityMap 확인: false면 숨김, 없거나 true면 표시
    const isVisible = visibilityMap[category.categorySeq];
    return isVisible !== false;
  });
};

const initialVisibilityMap = {};

const initialData = {
  categories: null as ICategoryWithMenus[] | null,
  visibilityMap: initialVisibilityMap,
  visibleCategories: [] as ICategoryWithMenus[],
};

/**
 * 카테고리 데이터를 관리하는 Zustand 스토어
 *
 * @description
 * - 카테고리 목록과 메뉴 정보를 저장하고 관리합니다
 * - 판매 시간/요일에 따른 카테고리 노출 여부를 visibilityMap으로 관리합니다
 * - isHidden과 visibilityMap을 기반으로 visibleCategories를 자동 계산합니다
 * - 데이터를 AppStorage에 저장하여 새로고침 시에도 유지됩니다
 */
export const useCategoryStore = create<ICategoryStore>((set, get) => {
  // 초기 데이터 로드 (비동기)
  AppStorage.loadData<ICategoryWithMenus[]>({
    key: STORAGE_KEYS.CATEGORIES,
  }).then((data) => {
    if (data?.value) {
      const categories = data.value;
      set({
        data: {
          categories,
          visibilityMap: initialVisibilityMap,
          visibleCategories: computeVisibleCategories(
            categories,
            initialVisibilityMap
          ),
        },
      });
    }
  });

  return {
    // 초기 상태
    data: initialData,

    // 데이터 설정 (스토리지에도 저장)
    setCategoriesAsync: ({
      categories,
    }: {
      categories: ICategoryWithMenus[];
    }) => {
      return new Promise((resolve) => {
        AppStorage.saveData({
          key: STORAGE_KEYS.CATEGORIES,
          value: categories,
          isTemporary: true,
        });
        set((state) => ({
          data: {
            ...state.data,
            categories,
            visibleCategories: computeVisibleCategories(
              categories,
              state.data.visibilityMap
            ),
          },
        }));
        resolve(true);
      });
    },

    // 데이터 초기화 (스토리지에서도 삭제)
    clearData: () => {
      AppStorage.removeData({
        key: STORAGE_KEYS.CATEGORIES,
      });
      set({ data: initialData });
    },

    // 모든 카테고리 visibility 업데이트
    updateAllVisibility: (visibilityMap: ICategoryVisibilityMap) => {
      set((state) => ({
        data: {
          ...state.data,
          visibilityMap: { ...visibilityMap },
          visibleCategories: computeVisibleCategories(
            state.data.categories,
            visibilityMap
          ),
        },
      }));
    },
  };
});
