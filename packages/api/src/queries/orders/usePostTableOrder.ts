import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { createTableOrder } from '../../fetchers/orders';
import type {
  ICreateTableOrderRequest,
  TCreateTableOrderResponse,
} from '../../types/orders';
import { IApiError } from '../../types/common';

export const usePostTableOrder = () => {
  return useMutation<
    TCreateTableOrderResponse,
    AxiosError<IApiError>,
    ICreateTableOrderRequest
  >({
    mutationFn: createTableOrder,
  });
};
