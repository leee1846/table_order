import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getCategoriesWithMenus } from '../../fetchers/category';
import { queryKeys } from '../queryKeys';
import type {
  IGetShopCategoriesWithMenusParams,
  TGetCategoryListResponse,
} from '../../types/category';
import { IApiError } from '../../types/common';

export const useGetCategoriesWithMenus = (
  params: IGetShopCategoriesWithMenusParams,
  options?: Omit<
    UseQueryOptions<TGetCategoryListResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetCategoryListResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.category.menuboardList(
      params.shopCode,
      params.tableNumber
    ),
    queryFn: () => getCategoriesWithMenus(params),
    ...options,
  });
};
