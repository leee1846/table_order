import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getTableGroupList } from '../../fetchers/table';
import { queryKeys } from '../queryKeys';
import type {
  IGetTableGroupListParams,
  TGetTableGroupListResponse,
} from '../../types/table';
import type { IApiError } from '../../types/common';

/**
 * 테이블 그룹 리스트 조회 훅
 */
export const useGetTableGroupList = (
  params: IGetTableGroupListParams,
  options?: Omit<
    UseQueryOptions<TGetTableGroupListResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetTableGroupListResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.table.groupList(params.shopCode),
    queryFn: () => getTableGroupList(params),
    ...options,
  });
};

