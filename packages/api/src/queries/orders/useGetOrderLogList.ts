import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getOrderLogList } from '../../fetchers/orders';
import { queryKeys } from '../queryKeys';
import type {
  IGetOrderLogParams,
  TGetOrderLogResponse,
} from '../../types/orders';
import type { IApiError } from '../../types/common';

export const useGetOrderLogList = (
  params: IGetOrderLogParams,
  options?: Omit<
    UseQueryOptions<TGetOrderLogResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetOrderLogResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.orders.orderLogList(
      params.shopCode,
      params.pageNumber ?? 0,
      params.pageSize ?? 10
    ),
    queryFn: () => getOrderLogList(params),
    ...options,
  });
};
