import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getAdminChangeHistoryList } from '../../fetchers/admin';
import type {
  THistoryCode,
  TGetAdminChangeHistoryListResponse,
} from '../../types/admin';
import type { AxiosError } from 'axios';
import type { IApiError } from '../../types/common';
import { queryKeys } from '../queryKeys';

export const useGetAdminHistoryList = (
  historyCode: THistoryCode,
  key: string,
  options?: Omit<
    UseQueryOptions<TGetAdminChangeHistoryListResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetAdminChangeHistoryListResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.admin.changeHistoryList(historyCode, key),
    queryFn: () => getAdminChangeHistoryList(historyCode, key),
    ...options,
  });
};
