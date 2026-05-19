import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getStoreGroupList } from '../../fetchers/storeGroup';
import type {
  IGetStoreGroupListParams,
  TGetStoreGroupListResponse,
} from '../../types/storeGroup';
import type { IApiError } from '../../types/common';
import { queryKeys } from '../queryKeys';

/**
 * 매장 그룹 리스트 조회 훅
 */
export const useGetStoreGroupList = (
  params: IGetStoreGroupListParams,
  options?: Omit<
    UseQueryOptions<TGetStoreGroupListResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetStoreGroupListResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.storeGroup.list(params.page, params.size, params.name),
    queryFn: () => getStoreGroupList(params),
    ...options,
  });
};
