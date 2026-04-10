import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getMenuSearch } from '../../fetchers/menu';
import { queryKeys } from '../queryKeys';
import type {
  IGetMenuSearchParams,
  TGetMenuSearchResponse,
} from '../../types/menu';
import type { IApiError } from '../../types/common';

/**
 * 메뉴 검색 조회 훅
 */
export const useGetMenuSearch = (
  params: IGetMenuSearchParams,
  options?: Omit<
    UseQueryOptions<TGetMenuSearchResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetMenuSearchResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.menu.search(params.name),
    queryFn: () => getMenuSearch(params),
    ...options,
  });
};
