import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { TGetDeviceDetailResponse } from '../../types/device';
import { AxiosError } from 'axios';
import { IApiError } from '../../types/common';
import { getDeviceDetail } from '../../fetchers/device';

export const useGetDeviceDetail = ({
  shopCode,
  androidId,
  options,
  ignoreGlobalErrors,
}: {
  shopCode: string;
  androidId: string;
  ignoreGlobalErrors?: number[];
  options?: Omit<
    UseQueryOptions<TGetDeviceDetailResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >;
}) => {
  return useQuery<TGetDeviceDetailResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.device.detail(shopCode, androidId),
    queryFn: () => getDeviceDetail(shopCode, androidId, ignoreGlobalErrors),
    ...options,
  });
};
