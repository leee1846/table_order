import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getStoreGroupDetail } from '../../fetchers/storeGroup';
import type { TGetStoreGroupDetailResponse } from '../../types/storeGroup';
import type { IApiError } from '../../types/common';
import { queryKeys } from '../queryKeys';

/**
 * 매장 그룹 상세 조회 훅
 */
export const useGetStoreGroupDetail = (
  id: string | number,
  options?: Omit<
    UseQueryOptions<TGetStoreGroupDetailResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetStoreGroupDetailResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.storeGroup.detail(id),
    queryFn: () => getStoreGroupDetail(id),
    // id가 유효할 때만 API 호출 (수정 모드일 때 유용함)
    enabled: !!id,
    ...options,
  });
};
