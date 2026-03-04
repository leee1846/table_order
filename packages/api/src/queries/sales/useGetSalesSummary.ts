import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getSalesSummary } from '../../fetchers/sales';
import { queryKeys } from '../queryKeys';
import type {
  IGetSalesSummaryParams,
  TGetSalesSummaryResponse,
} from '../../types/sales';
import type { IApiError } from '../../types/common';

export const useGetSalesSummary = (
  params: IGetSalesSummaryParams,
  options?: Omit<
    UseQueryOptions<TGetSalesSummaryResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetSalesSummaryResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.sales.summary(
      params.shopCode,
      params.startDate,
      params.endDate
    ),
    queryFn: () => getSalesSummary(params),
    ...options,
  });
};
