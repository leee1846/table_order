import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getCalendarSales } from '../../fetchers/sales';
import { queryKeys } from '../queryKeys';
import type {
  IGetCalendarSalesParams,
  TGetCalendarSalesResponse,
} from '../../types/sales';
import type { IApiError } from '../../types/common';

export const useGetCalendarSales = (
  params: IGetCalendarSalesParams,
  options?: Omit<
    UseQueryOptions<TGetCalendarSalesResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetCalendarSalesResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.sales.calendarSales(params.shopCode, params.yearMonth),
    queryFn: () => getCalendarSales(params),
    ...options,
  });
};
