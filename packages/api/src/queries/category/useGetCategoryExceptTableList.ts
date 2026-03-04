import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getCategoryExceptTableList } from '../../fetchers/category';
import { queryKeys } from '../queryKeys';
import type {
  IGetCategoryExceptTableParams,
  TGetCategoryExceptTableResponse,
} from '../../types/category';
import type { IApiError } from '../../types/common';

/**
 * 카테고리별 테이블 블랙리스트 조회 훅
 */
export const useGetCategoryExceptTableList = (
  params: IGetCategoryExceptTableParams,
  options?: Omit<
    UseQueryOptions<TGetCategoryExceptTableResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetCategoryExceptTableResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.category.exceptTable(
      params.shopCode,
      params.categorySeq
    ),
    queryFn: () => getCategoryExceptTableList(params),
    ...options,
  });
};
