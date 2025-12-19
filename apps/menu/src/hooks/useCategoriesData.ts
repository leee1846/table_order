import { useGetCategoriesWithMenus } from '@repo/api/queries';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { mockCategories } from '@/mocks/mockCategories';
import { useEffect } from 'react';
import { useShopData } from '@/hooks/useShopData';
import { useDeviceData } from '@/hooks/useDeviceData';
import type { ICategoryWithMenus, IMenu } from '@repo/api/types';

interface Props {
  /**
   * useEffect 실행을 건너뛸지 여부
   * 초기 api요청 건너뛰기 여부
   * @default false
   */
  skipInitialRequest?: boolean;
}

/**
 * 카테고리 데이터 로딩 및 모든 카테고리 선택자를 제공하는 훅
 *
 * @returns {object} 카테고리 관련 모든 데이터와 유틸리티
 * - categories: 원본 카테고리 목록
 * - visibleCategories: 보이는 카테고리 목록 (isHidden, visibility 필터링)
 * - staffCallCategory: 직원 호출 카테고리
 * - nonStaffCallCategories: 일반 카테고리 (직원 호출 제외)
 * - firstOrderRequiredCategories: 첫 주문 필수 카테고리 목록
 * - getVisibleMenus: 카테고리의 보이는 메뉴 목록 반환 함수
 * - refreshCategories: 카테고리 데이터 새로고침
 */
export const useCategoriesData = (options?: Props) => {
  const { skipInitialRequest = false } = options || {};

  const { shopData } = useShopData();
  const { data: deviceData } = useDeviceData();

  const {
    data: { categories: categoriesStoreData, visibleCategories },
    setCategoriesAsync,
  } = useCategoryStore();

  const enabled =
    !categoriesStoreData &&
    !!shopData?.shopCode &&
    !!deviceData?.tableNumber &&
    !skipInitialRequest;

  const { data: categoriesData, refetch } = useGetCategoriesWithMenus(
    {
      shopCode: shopData?.shopCode ?? '',
      tableNumber: deviceData?.tableNumber ?? 0,
    },
    { enabled }
  );

  useEffect(() => {
    if (skipInitialRequest) {
      return;
    }

    if (categoriesStoreData) {
      return;
    }

    if (categoriesData?.data) {
      // TODO: mockData 삭제 예정 -> categoriesData.data를 넣어야함
      // setCategoriesAsync(categoriesData.data);
      setCategoriesAsync({ categories: mockCategories });
    }
  }, [
    categoriesStoreData,
    categoriesData,
    setCategoriesAsync,
    skipInitialRequest,
  ]);

  const refresh = async () => {
    const result = await refetch();
    if (result.data?.data) {
      // TODO: mockData 삭제 예정 -> result.data.data를 넣어야함
      // await setCategoriesAsync(result.data.data);
      await setCategoriesAsync({ categories: mockCategories });
    }
  };

  // ===== 카테고리 분류 =====

  /** 직원 호출 카테고리 */
  const staffCallCategory = visibleCategories.find((c) => c.isStaffCall);

  /** 일반 카테고리 (직원 호출 제외) */
  const nonStaffCallCategories = visibleCategories.filter(
    (c) => !c.isStaffCall
  );

  /** 첫 주문 필수 카테고리 목록 */
  const firstOrderRequiredCategories = visibleCategories.filter(
    (c) => c.isFirstOrderRequired
  );

  // ===== 유틸리티 함수 =====

  /**
   * 카테고리의 보이는 메뉴 목록 반환 (isHidden 필터링)
   * @param category - 카테고리 객체
   * @returns 보이는 메뉴 목록
   */
  const getVisibleMenus = (category: ICategoryWithMenus): IMenu[] => {
    return category.menuInfoList.filter((menu) => !menu.isHidden);
  };

  return {
    // 원본 데이터
    categories: categoriesStoreData,
    visibleCategories,

    // 카테고리 분류
    staffCallCategory,
    nonStaffCallCategories,
    firstOrderRequiredCategories,

    // 유틸리티
    getVisibleMenus,
    refresh,
  };
};
