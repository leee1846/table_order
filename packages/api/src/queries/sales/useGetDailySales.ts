import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getDailySales } from '../../fetchers/sales';
import { queryKeys } from '../queryKeys';
import type {
  IGetDailySalesParams,
  TGetDailySalesResponse,
} from '../../types/sales';
import type { IApiError } from '../../types/common';

export const useGetDailySales = (
  params: IGetDailySalesParams,
  options?: Omit<
    UseQueryOptions<TGetDailySalesResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetDailySalesResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.sales.dailySales(
      params.shopCode,
      params.startDate,
      params.endDate
    ),
    queryFn: () => getDailySales(params),
    ...options,
  });
};

