import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { IApiError, TVoidApiResponse } from '../../types/common';
import { IPostDeviceDetailRequest } from '../../types/device';
import { AxiosError } from 'axios';
import { postDeviceDetail } from '../../fetchers/device';
import { queryKeys } from '../queryKeys';

interface Props {
  options?: Omit<
    UseMutationOptions<
      TVoidApiResponse,
      AxiosError<IApiError>,
      IPostDeviceDetailRequest
    >,
    'queryKey' | 'queryFn'
  >;
}

export const usePostDeviceDetail = (params?: Props) => {
  const { options } = params ?? {};

  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    IPostDeviceDetailRequest
  >({
    mutationFn: (params) => postDeviceDetail(params),
    mutationKey: queryKeys.device.postDetail,
    ...options,
  });
};
