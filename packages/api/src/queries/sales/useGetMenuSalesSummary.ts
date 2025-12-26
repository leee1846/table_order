import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getMenuSalesSummary } from '../../fetchers/sales';
import { queryKeys } from '../queryKeys';
import type {
  IGetMenuSalesSummaryParams,
  TGetMenuSalesSummaryResponse,
} from '../../types/sales';
import type { IApiError } from '../../types/common';

export const useGetMenuSalesSummary = (
  params: IGetMenuSalesSummaryParams,
  options?: Omit<
    UseQueryOptions<TGetMenuSalesSummaryResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetMenuSalesSummaryResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.sales.menuSalesSummary(
      params.shopCode,
      params.startDate,
      params.endDate
    ),
    queryFn: () => getMenuSalesSummary(params),
    ...options,
  });
};
