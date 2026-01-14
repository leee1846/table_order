import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getOneDaySales } from '../../fetchers/sales';
import { queryKeys } from '../queryKeys';
import type {
  IGetOneDaySalesParams,
  TGetOneDaySalesResponse,
} from '../../types/sales';
import type { IApiError } from '../../types/common';

export const useGetOneDaySales = (
  params: IGetOneDaySalesParams,
  options?: Omit<
    UseQueryOptions<TGetOneDaySalesResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetOneDaySalesResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.sales.oneDaySales(
      params.shopCode,
      params.saleDate,
      params.paymentType ?? undefined
    ),
    queryFn: () => getOneDaySales(params),
    ...options,
  });
};
