import type { IGetShop } from '@repo/api/types';
import { useGetCategoriesWithMenus } from '@repo/api/queries';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { mockCategories } from '@/mocks/mockCategories';
import { useEffect } from 'react';

interface Props {
  shopData?: IGetShop | null;
  tableNumber?: number;
}
export const useCategoriesData = ({ shopData, tableNumber }: Props) => {
  const {
    categories: categoriesStoreData,
    setCategories: setCategoriesStoreData,
    visibleCategories,
  } = useCategoryStore();

  const enabled = !categoriesStoreData && !!shopData?.shopCode && !!tableNumber;
  const { data: categoriesData, refetch } = useGetCategoriesWithMenus(
    { shopCode: shopData?.shopCode ?? '', tableNumber: tableNumber ?? 0 },
    { enabled }
  );

  useEffect(() => {
    if (categoriesData?.data) {
      // TODO: mockData 삭제 예정 -> categoriesData.data를 넣어야함
      setCategoriesStoreData(mockCategories);
    }
  }, [categoriesData, setCategoriesStoreData]);

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
