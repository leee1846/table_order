import type { IApiError, IPaginationParams } from '../../types/common';
import type { TGetAdminMemberListResponse } from '../../types/admin';
import type { AxiosError } from 'axios';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { getAdminMemberList } from '../../fetchers/admin';

/**
 * 관리자 목록 조회
 * 마스터/점주를 제외한 관리자 목록 조회
 */
export const useGetAdminMemberList = (
  params: IPaginationParams,
  options?: Omit<
    UseQueryOptions<TGetAdminMemberListResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetAdminMemberListResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.admin.memberList(
      params.pageNumber,
      params.pageSize,
      params.searchWord
    ),
    queryFn: () => getAdminMemberList(params),
    ...options,
  });
};
