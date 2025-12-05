import type { IGetShop } from '@repo/api/types';
import { useGetCategoriesWithMenus } from '@repo/api/queries';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { mockCategories } from '@/mocks/mockCategories';
import { useEffect } from 'react';

interface Props {
  /**
   * useEffect 실행을 건너뛸지 여부
   * 초기 api요청 건너뛰기 여부
   * @default false
   */
  skipInitialRequest?: boolean;
  shopData?: IGetShop | null;
  tableNumber?: number;
}
export const useCategoriesData = (options?: Props) => {
  const { skipInitialRequest = false, shopData, tableNumber } = options || {};

  const {
    categories: categoriesStoreData,
    setCategories: setCategoriesStoreData,
    visibleCategories,
  } = useCategoryStore();

  const enabled =
    !categoriesStoreData &&
    !!shopData?.shopCode &&
    !!tableNumber &&
    !skipInitialRequest;

  const { data: categoriesData, refetch } = useGetCategoriesWithMenus(
    { shopCode: shopData?.shopCode ?? '', tableNumber: tableNumber ?? 0 },
    { enabled }
  );

  useEffect(() => {
    if (skipInitialRequest) {
      return;
    }

    if (categoriesData?.data) {
      // TODO: mockData 삭제 예정 -> categoriesData.data를 넣어야함
      setCategoriesStoreData(mockCategories);
    }
  }, [categoriesData, setCategoriesStoreData, skipInitialRequest]);

  const refresh = async () => {
    const result = await refetch();
    if (result.data?.data) {
      setCategoriesStoreData(result.data.data);
    }
  };

  return {
    data: categoriesStoreData,
    visibleCategories,
    refresh,
  };
};
