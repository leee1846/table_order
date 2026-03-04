import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getLatestAppVersion } from '../../fetchers';
import { queryKeys } from '../queryKeys';
import type { TAppType, TGetLatestAppVersionResponse } from '../../types/app';
import type { IApiError } from '../../types/common';

export const useGetLatestAppVersion = (
  appType: TAppType,
  options?: Omit<
    UseQueryOptions<TGetLatestAppVersionResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetLatestAppVersionResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.app.latestVersion(appType),
    queryFn: () => getLatestAppVersion(appType),
    ...options,
  });
};
