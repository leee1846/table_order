import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { createTableOrder } from '../../fetchers/orders';
import type { ICreateTableOrderRequest } from '../../types/orders';
import { IApiError, TVoidApiResponse } from '../../types/common';

export const usePostTableOrder = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    ICreateTableOrderRequest
  >({
    mutationFn: createTableOrder,
  });
};
