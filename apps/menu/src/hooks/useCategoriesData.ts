import { useGetCategoriesWithMenus } from '@repo/api/queries';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { mockCategories } from '@/mocks/mockCategories';
import { useEffect } from 'react';
import { useShopData } from '@/hooks/useShopData';
import { useDeviceData } from '@/hooks/useDeviceData';

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
  const { data: deviceData } = useDeviceData();

  const {
    categories: categoriesStoreData,
    setCategoriesAsync: setCategoriesStoreData,
    visibleCategories,
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

    if (categoriesData?.data) {
      // TODO: mockData 삭제 예정 -> categoriesData.data를 넣어야함
      // setCategoriesStoreData(categoriesData.data);
      setCategoriesStoreData(mockCategories);
    }
  }, [categoriesData, setCategoriesStoreData, skipInitialRequest]);

  const refresh = async () => {
    const result = await refetch();
    if (result.data?.data) {
      // TODO: mockData 삭제 예정 -> categoriesData.data를 넣어야함
      // await setCategoriesStoreData(result.data.data);
      await setCategoriesStoreData(mockCategories);
    }
  };

  return {
    data: categoriesStoreData,
    visibleCategories,
    refresh,
  };
};
