import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getCardApprovalHistory } from '../../fetchers/sales';
import { queryKeys } from '../queryKeys';
import type {
  IGetCardApprovalHistoryParams,
  TGetCardApprovalHistoryResponse,
} from '../../types/sales';
import type { IApiError } from '../../types/common';

export const useGetCardApprovalHistory = (
  params: IGetCardApprovalHistoryParams,
  options?: Omit<
    UseQueryOptions<TGetCardApprovalHistoryResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetCardApprovalHistoryResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.sales.cardApprovalHistory(
      params.shopCode,
      params.startDate,
      params.endDate,
      params.pageNumber ?? 0,
      params.pageSize ?? 10
    ),
    queryFn: () => getCardApprovalHistory(params),
    ...options,
  });
};
