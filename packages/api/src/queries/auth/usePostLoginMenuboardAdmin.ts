import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { IApiError, TVoidApiResponse } from '../../types/common';
import { loginMenuboardAdmin } from '../../fetchers/auth';
import { AxiosError } from 'axios';
import { ILoginMenuboardAdminRequest } from '../../types/auth';

export const usePostLoginMenuboardAdmin = (params?: {
  ignoreGlobalErrors?: number[];
  options?: Omit<
    UseMutationOptions<
      TVoidApiResponse,
      AxiosError<IApiError>,
      ILoginMenuboardAdminRequest
    >,
    'queryKey' | 'queryFn'
  >;
}) => {
  const { ignoreGlobalErrors = [], options } = params ?? {};
  return useMutation({
    mutationFn: (params) =>
      loginMenuboardAdmin({ ...params, ignoreGlobalErrors }),
    ...options,
  });
};
