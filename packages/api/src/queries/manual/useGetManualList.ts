import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { IApiError } from '../../types/common';
import { queryKeys } from '../queryKeys';
import {
  TGetManualListResponse,
  IGetManualListParams,
} from '../../types/manual';
import { getManualList } from '../../fetchers/manual';

export const useGetManualList = (
  params: IGetManualListParams,
  options?: Omit<
    UseQueryOptions<TGetManualListResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetManualListResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.manual.list(
      params.page,
      params.pageSize,
      params.searchWord
    ),
    queryFn: () => getManualList(params),
    ...options,
  });
};
