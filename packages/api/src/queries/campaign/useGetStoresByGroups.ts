import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getStoresByGroups } from '../../fetchers/campaign';
import type { IApiError } from '../../types/common';
import type { TGetStoresByGroupsResponse } from '../../types/storeGroup';
// import { queryKeys } from '../queryKeys'; // 프로젝트에 맞춰 queryKeys 사용 시 주석 해제

/**
 * 그룹에 포함된 매장 목록 조회 훅
 */
export const useGetStoresByGroups = (
  storeGroupSeqs: number[],
  options?: Omit<
    UseQueryOptions<TGetStoresByGroupsResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  const queryKey = ['store-groups', 'stores', storeGroupSeqs]; // queryKeys.storeGroup?.stores(storeGroupSeqs) 구조로 대체 가능

  return useQuery<TGetStoresByGroupsResponse, AxiosError<IApiError>>({
    queryKey,
    queryFn: () => getStoresByGroups(storeGroupSeqs),
    enabled: Array.isArray(storeGroupSeqs) && storeGroupSeqs.length > 0,
    ...options,
  });
};
