import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getAdminShopList } from '../../fetchers/admin';
import { queryKeys } from '../queryKeys';
import {
  IGetAdminShopListParams,
  TGetAdminShopListResponse,
} from '../../types/admin';
import { AxiosError } from 'axios';
import { IApiError } from '../../types/common';

export const useGetAdminShopList = (
  params: IGetAdminShopListParams,
  options?: Omit<
    UseQueryOptions<TGetAdminShopListResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetAdminShopListResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.admin.shopList(
      params.pageNumber,
      params.pageSize,
      params.searchWord
    ),
    queryFn: () => getAdminShopList(params),
    ...options,
  });
};
