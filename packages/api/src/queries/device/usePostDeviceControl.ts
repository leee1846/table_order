import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { postDeviceControl } from '../../fetchers/device';
import type {
  IPostDeviceControlRequest,
  TPostDeviceControlResponse,
} from '../../types/device';
import type { IApiError } from '../../types/common';

interface Props {
  options?: Omit<
    UseMutationOptions<
      TPostDeviceControlResponse,
      AxiosError<IApiError>,
      IPostDeviceControlRequest
    >,
    'mutationFn'
  >;
}

export const usePostDeviceControl = (params?: Props) => {
  const { options } = params ?? {};

  return useMutation<
    TPostDeviceControlResponse,
    AxiosError<IApiError>,
    IPostDeviceControlRequest
  >({
    mutationFn: postDeviceControl,
    ...options,
  });
};
