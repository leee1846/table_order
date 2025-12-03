import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getShops } from '../../fetchers';
import { TGetShopResponse } from '../../types/shop';
import { AxiosError } from 'axios';
import { IApiError } from '../../types/common';
import { queryKeys } from '../queryKeys';

export const useGetShops = (
  options?: Omit<
    UseQueryOptions<TGetShopResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetShopResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.shop.list(),
    queryFn: getShops,
    ...options,
  });
};
