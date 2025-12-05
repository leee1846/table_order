import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getShopDetail } from '../../fetchers/shop';
import { queryKeys } from '../queryKeys';
import type { TGetShopResponse } from '../../types/shop';
import type { IApiError } from '../../types/common';

export const useGetShopDetail = (
  shopCode: string,
  options?: Omit<
    UseQueryOptions<TGetShopResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetShopResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.shop.detail(shopCode),
    queryFn: () => getShopDetail(shopCode),
    ...options,
  });
};
