import { create } from '@repo/feature/zustand';
import type { ICategory } from '@repo/api/types';
import { createInitialState, type IBaseStore } from '@/stores/types';
import { STORAGE_KEYS } from '@/constants/keys';
import storage from '@/utils/storage';

export type ICategoryStore = IBaseStore<ICategory[]>;

/**
 * 카테고리 데이터를 관리하는 스토어
 * - API 응답을 받아 스토리지에 저장
 */
export const useCategoryStore = create<ICategoryStore>((set) => ({
  // 초기 상태
  ...createInitialState<ICategory[]>(),

  // 데이터 설정 (스토리지에도 저장)
  setData: (data: ICategory[]) => {
    const success = storage.save(STORAGE_KEYS.CATEGORIES, data);
    if (success) {
      set({
        data,
        lastUpdated: Date.now(),
        error: null,
      });
    } else {
      set({
        error: new Error('Failed to save to category store'),
      });
    }
  },

  // 데이터 초기화 (스토리지에서도 삭제)
  clearData: () => {
    storage.remove(STORAGE_KEYS.CATEGORIES);
    set({
      ...createInitialState<ICategory[]>(),
    });
  },

  // 로딩 상태 설정
  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  // 에러 설정
  setError: (error: Error | null) => {
    set({ error });
  },

  // 스토리지에서 데이터 불러오기
  loadFromStorage: () => {
    const storedData = storage.load<ICategory[]>(STORAGE_KEYS.CATEGORIES);
    if (storedData) {
      set({
        data: storedData,
        lastUpdated: Date.now(),
        error: null,
      });
    }
  },
}));
