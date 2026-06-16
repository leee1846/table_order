import { AxiosError } from 'axios';
import { postDeviceLogout } from '../../fetchers/device';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { TVoidApiResponse, IApiError } from '../../types/common';

interface Props {
  options?: Omit<
    UseMutationOptions<TVoidApiResponse, AxiosError<IApiError>, string>,
    'mutationFn' | 'queryKey'
  >;
  ignoreGlobalErrors?: number[];
}

export const usePostDeviceLogout = (params?: Props) => {
  const { options, ignoreGlobalErrors = [] } = params ?? {};

  return useMutation<TVoidApiResponse, AxiosError<IApiError>, string>({
    mutationFn: (shopCode) => postDeviceLogout(shopCode, ignoreGlobalErrors),
    ...options,
  });
};
