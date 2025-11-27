import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getMenuListByCategory } from '../../fetchers/menu';
import { queryKeys } from '../queryKeys';
import type {
  IGetMenuListParams,
  TGetMenuListResponse,
} from '../../types/menu';
import type { IApiError } from '../../types/common';

/**
 * 카테고리별 메뉴 리스??조회 훅
 */
export const useGetMenuList = (
  params: IGetMenuListParams,
  options?: Omit<
    UseQueryOptions<TGetMenuListResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetMenuListResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.menu.list(params.categorySeq),
    queryFn: () => getMenuListByCategory(params),
    ...options,
  });
};
