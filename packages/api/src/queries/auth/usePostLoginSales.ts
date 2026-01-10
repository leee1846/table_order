import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { loginSales } from '../../fetchers/auth';
import type { ILoginSalesRequest } from '../../types/auth';
import type { IApiError, TVoidApiResponse } from '../../types/common';

export const usePostLoginSales = (params?: {
  ignoreGlobalErrors?: number[];
  options?: Omit<
    UseMutationOptions<
      TVoidApiResponse,
      AxiosError<IApiError>,
      ILoginSalesRequest
    >,
    'queryKey' | 'queryFn'
  >;
}) => {
  const { ignoreGlobalErrors = [], options } = params ?? {};

  return useMutation({
    mutationFn: (mutationParams) =>
      loginSales({ ...mutationParams, ignoreGlobalErrors }),
    ...options,
  });
};
