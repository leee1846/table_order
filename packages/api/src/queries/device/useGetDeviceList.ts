import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { TGetDeviceListResponse } from '../../types/device';
import { AxiosError } from 'axios';
import { IApiError } from '../../types/common';
import { queryKeys } from '../queryKeys';
import { getDeviceList } from '../../fetchers/device';

export const useGetDeviceList = ({
  shopCode,
  options,
}: {
  shopCode: string;
  options?: Omit<
    UseQueryOptions<TGetDeviceListResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >;
}) => {
  return useQuery<TGetDeviceListResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.device.list(shopCode),
    queryFn: () => getDeviceList(shopCode),
    ...options,
  });
};
