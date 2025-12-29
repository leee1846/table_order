import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getDeviceListWithPagination } from '../../fetchers/device';
import { queryKeys } from '../queryKeys';
import type {
  IGetDeviceListWithPaginationParams,
  TGetDeviceListWithPaginationResponse,
} from '../../types/device';
import type { IApiError } from '../../types/common';

export const useGetDeviceListWithPagination = ({
  shopCode,
  pageNumber,
  pageSize,
  options,
}: IGetDeviceListWithPaginationParams & {
  options?: Omit<
    // TODO 이거 왜 필요한거임?
    UseQueryOptions<
      TGetDeviceListWithPaginationResponse,
      AxiosError<IApiError>
    >,
    'queryKey' | 'queryFn'
  >;
}) => {
  return useQuery<TGetDeviceListWithPaginationResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.device.listWithPagination(
      shopCode,
      pageNumber ?? 0,
      pageSize ?? 10
    ),
    queryFn: () =>
      getDeviceListWithPagination({
        shopCode,
        pageNumber,
        pageSize,
      }),
    ...options,
  });
};
