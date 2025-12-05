import { useGetCategoriesWithMenus } from '@repo/api/queries';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { mockCategories } from '@/mocks/mockCategories';
import { useEffect } from 'react';
import { useShopData } from '@/hooks/useShopData';
import { useTableData } from '@/hooks/useTableData';

interface Props {
  /**
   * useEffect 실행을 건너뛸지 여부
   * 초기 api요청 건너뛰기 여부
   * @default false
   */
  skipInitialRequest?: boolean;
}
export const useCategoriesData = (options?: Props) => {
  const { skipInitialRequest = false } = options || {};

  const { shopData } = useShopData();
  const { table } = useTableData();

  const {
    categories: categoriesStoreData,
    setCategories: setCategoriesStoreData,
    visibleCategories,
  } = useCategoryStore();

  const enabled =
    !categoriesStoreData &&
    !!shopData?.shopCode &&
    !!table?.tableNumber &&
    !skipInitialRequest;

  const { data: categoriesData, refetch } = useGetCategoriesWithMenus(
    {
      shopCode: shopData?.shopCode ?? '',
      tableNumber: table?.tableNumber ?? 0,
    },
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
