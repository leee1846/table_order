import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getCurrentTableList } from '../../fetchers/orders';
import { queryKeys } from '../queryKeys';
import type {
  IGetCurrentTableListParams,
  TGetCurrentTableListResponse,
} from '../../types/orders';
import type { IApiError } from '../../types/common';

export const useGetCurrentTableList = (
  params: IGetCurrentTableListParams,
  options?: Omit<
    UseQueryOptions<TGetCurrentTableListResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetCurrentTableListResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.orders.currentTableList(params.shopCode),
    queryFn: () => getCurrentTableList(params),
    ...options,
  });
};

