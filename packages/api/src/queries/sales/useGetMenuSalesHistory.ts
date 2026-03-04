import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getMenuSalesHistory } from '../../fetchers/sales';
import { queryKeys } from '../queryKeys';
import type {
  IGetMenuSalesHistoryParams,
  TGetMenuSalesHistoryResponse,
} from '../../types/sales';
import type { IApiError } from '../../types/common';

export const useGetMenuSalesHistory = (
  params: IGetMenuSalesHistoryParams,
  options?: Omit<
    UseQueryOptions<TGetMenuSalesHistoryResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetMenuSalesHistoryResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.sales.menuSalesHistory(
      params.shopCode,
      params.startDate,
      params.endDate
    ),
    queryFn: () => getMenuSalesHistory(params),
    ...options,
  });
};
