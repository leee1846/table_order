import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { IApiError } from '../../types/common';
import {
  ILoginMenuboardAdminRequest,
  TLoginMenuboardAdminResponse,
} from '../../types/auth';
import { loginMenuboardAdmin } from '../../fetchers/auth';
import { AxiosError } from 'axios';

export const usePostLoginMenuboardAdmin = (params?: {
  ignoreGlobalErrors?: number[];
  options?: Omit<
    UseMutationOptions<
      TLoginMenuboardAdminResponse,
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
