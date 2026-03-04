import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getAdminShopDetail } from '../../fetchers/admin';
import { queryKeys } from '../queryKeys';
import { TGetAdminShopDetailResponse } from '../../types/admin';
import { AxiosError } from 'axios';
import { IApiError } from '../../types/common';

export const useGetAdminShopDetail = (
  shopCode: string,
  options?: Omit<
    UseQueryOptions<TGetAdminShopDetailResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetAdminShopDetailResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.admin.shopDetail(shopCode),
    queryFn: () => getAdminShopDetail(shopCode),
    ...options,
  });
};
