import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getTableOrderHistories } from '../../fetchers/orders';
import { queryKeys } from '../queryKeys';
import type {
  IGetTableOrderHistoriesParams,
  TGetTableOrderHistoriesResponse,
} from '../../types/orders';
import type { IApiError } from '../../types/common';

export const useGetTableOrderHistories = (
  params: IGetTableOrderHistoriesParams,
  options?: Omit<
    UseQueryOptions<TGetTableOrderHistoriesResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  > & { ignoreGlobalErrors?: number[] }
) => {
  const { ignoreGlobalErrors, ...queryOptions } = options ?? {};
  return useQuery<TGetTableOrderHistoriesResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.orders.tableOrderHistories(
      params.shopCode,
      params.tableNumber
    ),
    queryFn: () =>
      getTableOrderHistories({ ...params, ignoreGlobalErrors }),
    ...queryOptions,
  });
};
