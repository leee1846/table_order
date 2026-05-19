import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getStoreGroupMembers } from '../../fetchers/storeGroup';
import type { TGetStoreGroupMembersResponse } from '../../types/storeGroup';
import type { IApiError } from '../../types/common';
import { queryKeys } from '../queryKeys';

/**
 * 매장 그룹 멤버 목록 조회 훅
 */
export const useGetStoreGroupMembers = (
  storeGroupSeq: string | number,
  options?: Omit<
    UseQueryOptions<TGetStoreGroupMembersResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetStoreGroupMembersResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.storeGroup.members(storeGroupSeq),
    queryFn: () => getStoreGroupMembers(storeGroupSeq),
    // storeGroupSeq가 유효할 때만 API 호출
    enabled: !!storeGroupSeq,
    ...options,
  });
};
