import { create } from '@repo/feature/zustand';
import type { ICategoryWithMenus } from '@repo/api/types';
import { STORAGE_KEYS } from '@/constants/keys';
import storage from '@/utils/storage';

/**
 * 카테고리 요일/시간 기반의 노출여부 상태 관리
 * key: categorySeq, value: 카테고리가 현재 보이는지 여부
 */
export type ICategoryVisibilityMap = Record<number, boolean>;

export interface ICategoryStore {
  categories: ICategoryWithMenus[] | null;
  /** 카테고리 노출여부 상태 맵  */
  visibilityMap: ICategoryVisibilityMap;

  /** 데이터 설정 (세션 스토리지에도 저장) */
  setCategories: (categories: ICategoryWithMenus[]) => void;
  /** 데이터 초기화 (세션 스토리지에서도 삭제) */
  clearData: () => void;
  /** 세션 스토리지에서 데이터 불러오기 */
  loadFromStorage: () => void;

  /** 카테고리 노출여부 상태 맵 업데이트 */
  updateVisibility: (categorySeq: number, isVisible: boolean) => void;
  /** 모든 카테고리 노출여부 상태 맵 업데이트 */
  updateAllVisibility: (visibilityMap: ICategoryVisibilityMap) => void;
  /** 필터링된 보이는 카테고리 목록 반환 */
  getVisibleCategories: () => ICategoryWithMenus[];
}

const initialData = {
  categories:
    storage.load<ICategoryWithMenus[]>(STORAGE_KEYS.CATEGORIES) ?? null,
  visibilityMap: {},
};

/**
 * 카테고리 데이터를 관리하는 스토어
 * - API 응답을 받아 스토리지에 저장
 * - 판매 가능 여부에 따른 visibility 관리
 */
export const useCategoryStore = create<ICategoryStore>((set) => ({
  // 초기 상태
  ...initialData,

  // 데이터 설정 (스토리지에도 저장)
  setCategories: (categories: ICategoryWithMenus[]) => {
    storage.save(STORAGE_KEYS.CATEGORIES, categories);
    set({ categories });
  },

  // 데이터 초기화 (스토리지에서도 삭제)
  clearData: () => {
    storage.remove(STORAGE_KEYS.CATEGORIES);
    set({ ...initialData });
  },

  // 스토리지에서 데이터 불러오기
  loadFromStorage: () => {
    const storedData = storage.load<ICategoryWithMenus[]>(
      STORAGE_KEYS.CATEGORIES
    );
    if (storedData) {
      set({ categories: storedData });
    }
  },

  // 카테고리 visibility 업데이트
  updateVisibility: (categorySeq: number, isVisible: boolean) => {
    set((state) => ({
      visibilityMap: {
        ...state.visibilityMap,
        [categorySeq]: isVisible,
      },
    }));
  },

  // 모든 카테고리 visibility 업데이트
  updateAllVisibility: (visibilityMap: ICategoryVisibilityMap) => {
    set({
      visibilityMap: { ...visibilityMap },
    });
  },

  // 필터링된 보이는 카테고리 목록 반환
  getVisibleCategories: (): ICategoryWithMenus[] => {
    const state = useCategoryStore.getState() as ICategoryStore;
    if (!state.categories) {
      return [];
    }

    return state.categories.filter((category: ICategoryWithMenus) => {
      // isHidden이 true이면 숨김
      if (category.isHidden) {
        return false;
      }
      // visibilityMap 확인: false면 숨김, 없거나 true면 표시
      const isVisible = state.visibilityMap[category.categorySeq];
      return isVisible !== false;
    });
  },
}));
