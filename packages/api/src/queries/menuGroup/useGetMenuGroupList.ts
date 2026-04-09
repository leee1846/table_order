import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getMenuGroupList } from '../../fetchers/menuGroup';
import type {
  IGetMenuGroupListParams,
  TGetMenuGroupListResponse,
} from '../../types/menuGroup';
import type { IApiError } from '../../types/common';
import { queryKeys } from '../queryKeys';

/**
 * 메뉴 그룹 리스트 조회 훅 (list_2 API 연동)
 */
export const useGetMenuGroupList = (
  params: IGetMenuGroupListParams,
  options?: Omit<
    UseQueryOptions<TGetMenuGroupListResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetMenuGroupListResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.menuGroup.list(
      params.page,
      params.size,
      params.keyword
    ),
    queryFn: () => getMenuGroupList(params),
    ...options,
  });
};
