import { useQuery } from '@tanstack/react-query';
import type {
  IApiResponse,
  IApiError,
  IAppVersionResponse,
  TAppVersionType,
} from '../../types/common';
import { AxiosError } from 'axios';
import { queryKeys } from '../queryKeys';
import { getLatestVersion } from '../../fetchers';

export const useGetAppLatestVersion = (type: TAppVersionType) => {
  return useQuery<IApiResponse<IAppVersionResponse>, AxiosError<IApiError>>({
    queryKey: queryKeys.common.latestVersion(type),
    queryFn: () => getLatestVersion(type),
  });
};
