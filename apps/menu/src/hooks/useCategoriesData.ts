import { useGetCategoriesWithMenus } from '@repo/api/queries';
import { useCategoryStore } from '@/stores/useCategoryStore';
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
 * 카테고리 데이터를 로드하고 분류하여 제공하는 커스텀 훅
 *
 * @description
 * - 매장 코드와 테이블 번호를 기반으로 카테고리 데이터를 로드합니다
 * - Store에 데이터가 있으면 API 호출을 건너뜁니다
 * - 직원 호출 카테고리, 첫 주문 필수 카테고리 등을 분류하여 제공합니다
 *
 * @param options - 옵션 설정
 * @returns 카테고리 데이터, 분류된 카테고리 목록 및 유틸리티 함수
 */
export const useCategoriesData = (options?: Props) => {
  const { skipInitialRequest = false } = options || {};

  const { shopData } = useShopData({ skipInitialRequest: true });
  const { data: deviceData } = useDeviceData({ skipInitialRequest: true });

  const {
    data: { categories: storeData, visibleCategories },
    setCategoriesAsync,
  } = useCategoryStore();

  const enabled =
    !storeData &&
    !!shopData?.shopCode &&
    !!deviceData?.tableNumber &&
    !skipInitialRequest;

  const { data: apiData, refetch } = useGetCategoriesWithMenus(
    {
      shopCode: shopData?.shopCode ?? '',
      tableNumber: deviceData?.tableNumber ?? '',
    },
    { enabled }
  );

  useEffect(() => {
    if (skipInitialRequest) {
      return;
    }

    if (storeData) {
      return;
    }

    if (apiData?.data) {
      setCategoriesAsync({ categories: apiData.data });
    }
  }, [storeData, apiData, setCategoriesAsync, skipInitialRequest]);

  const refresh = async () => {
    const result = await refetch();
    if (result.data?.data) {
      await setCategoriesAsync({ categories: result.data.data });
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

  return {
    // 원본 데이터
    categories: storeData,
    visibleCategories,

    // 카테고리 분류
    staffCallCategory,
    nonStaffCallCategories,
    firstOrderRequiredCategories,

    refresh,
  };
};
