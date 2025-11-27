import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getCategoryList } from '../../fetchers/category';
import { queryKeys } from '../queryKeys';
import type {
  IGetCategoryListParams,
  TGetCategoryListResponse,
} from '../../types/category';
import { IApiError } from '../../types/common';

/**
 * 카테고리 리스트를 조회합니다.
 */
export const useGetCategoryList = (
  params: IGetCategoryListParams,
  options?: Omit<
    UseQueryOptions<TGetCategoryListResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetCategoryListResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.category.list(),
    queryFn: () => getCategoryList(params),
    ...options,
  });
};
