import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getOrderHistory } from '../../fetchers/sales';
import { queryKeys } from '../queryKeys';
import type {
  IGetOrderHistoryParams,
  TGetOrderHistoryResponse,
} from '../../types/sales';
import type { IApiError } from '../../types/common';

export const useGetOrderHistory = (
  params: IGetOrderHistoryParams,
  options?: Omit<
    UseQueryOptions<TGetOrderHistoryResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetOrderHistoryResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.sales.orderHistory(
      params.shopCode,
      params.startDate,
      params.endDate,
      params.pageNumber ?? 0,
      params.pageSize ?? 5
    ),
    queryFn: () => getOrderHistory(params),
    ...options,
  });
};
