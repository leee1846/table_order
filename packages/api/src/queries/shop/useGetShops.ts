import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getShops } from '../../fetchers';
import { TGetShopsResponse } from '../../types/shop';
import { AxiosError } from 'axios';
import { IApiError } from '../../types/common';
import { queryKeys } from '../queryKeys';

export const useGetShops = (
  options?: Omit<
    UseQueryOptions<TGetShopsResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetShopsResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.shop.list(),
    queryFn: getShops,
    ...options,
  });
};
