import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { IApiError } from '../../types/common';
import { queryKeys } from '../queryKeys';
import {
  IGetAppVersionListParams,
  TGetAppVersionListResponse,
} from '../../types/app';
import { getAppVersionList } from '../../fetchers/app';

export const useGetAppVersionList = (
  params: IGetAppVersionListParams,
  options?: Omit<
    UseQueryOptions<TGetAppVersionListResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetAppVersionListResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.app.versionList(
      params.pageNumber,
      params.pageSize,
      params.searchWord
    ),
    queryFn: () => getAppVersionList(params),
    ...options,
  });
};
