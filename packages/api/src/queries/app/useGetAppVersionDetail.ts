import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { queryKeys } from '../queryKeys';
import { TGetAppVersionResponse } from '../../types/app';
import type { IApiError } from '../../types/common';
import { getAppVersionDetail } from '../../fetchers/app';

export const useGetAppVersionDetail = (
  appVersionSeq: number,
  options?: Omit<
    UseQueryOptions<TGetAppVersionResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetAppVersionResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.app.versionDetail(appVersionSeq),
    queryFn: () => getAppVersionDetail(appVersionSeq),
    ...options,
  });
};
