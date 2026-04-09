import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getStoreList } from '../../fetchers/store';
import type {
  IGetStoreListParams,
  TGetStoreListResponse,
} from '../../types/store';
import type { IApiError } from '../../types/common';
import { queryKeys } from '../queryKeys';

/**
 * 매장 리스트 조회 훅
 */
export const useGetStoreList = (
  params: IGetStoreListParams,
  options?: Omit<
    UseQueryOptions<TGetStoreListResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetStoreListResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.store.list(params.page, params.size, params.keyword),
    queryFn: () => getStoreList(params),
    ...options,
  });
};
