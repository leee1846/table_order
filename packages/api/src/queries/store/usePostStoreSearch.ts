import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getStoreSearch } from '../../fetchers/store';
import type {
  IPostStoreSearchParams,
  TPostStoreSearchResponse,
} from '../../types/store';
import type { IApiError } from '../../types/common';
import { queryKeys } from '../queryKeys';

/**
 * 매장 검색 조회 훅
 */
export const usePostStoreSearch = (
  params: IPostStoreSearchParams,
  options?: Omit<
    UseQueryOptions<TPostStoreSearchResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TPostStoreSearchResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.store.search(
      params.shopCodes,
      params.page,
      params.size
    ),
    queryFn: () => getStoreSearch(params),
    ...options,
  });
};
