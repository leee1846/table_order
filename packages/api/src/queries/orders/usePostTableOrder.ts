import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { createTableOrder } from '../../fetchers/orders';
import type {
  ICreateTableOrderRequest,
  TCreateTableOrderResponse,
} from '../../types/orders';
import { IApiError } from '../../types/common';

export const usePostTableOrder = (options?: {
  ignoreGlobalErrors?: number[];
  skipGlobalErrorHandling?: boolean;
}) => {
  const { ignoreGlobalErrors = [], skipGlobalErrorHandling = false } =
    options ?? {};
  return useMutation<
    TCreateTableOrderResponse,
    AxiosError<IApiError>,
    ICreateTableOrderRequest
  >({
    mutationFn: (params) =>
      createTableOrder({
        ...params,
        ignoreGlobalErrors,
        skipGlobalErrorHandling,
      }),
  });
};
