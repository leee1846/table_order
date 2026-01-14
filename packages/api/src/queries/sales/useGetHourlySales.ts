import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getHourlySales } from '../../fetchers/sales';
import { queryKeys } from '../queryKeys';
import type {
  IGetHourlySalesParams,
  TGetHourlySalesResponse,
} from '../../types/sales';
import type { IApiError } from '../../types/common';

export const useGetHourlySales = (
  params: IGetHourlySalesParams,
  options?: Omit<
    UseQueryOptions<TGetHourlySalesResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetHourlySalesResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.sales.hourlySales(
      params.shopCode,
      params.startDate,
      params.endDate
    ),
    queryFn: () => getHourlySales(params),
    ...options,
  });
};
