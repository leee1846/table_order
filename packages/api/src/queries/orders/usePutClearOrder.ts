import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { clearOrder } from '../../fetchers/orders';
import type { IClearOrderRequest } from '../../types/orders';
import type { IApiError, TVoidApiResponse } from '../../types/common';

export const usePutClearOrder = () => {
  return useMutation<TVoidApiResponse, AxiosError<IApiError>, IClearOrderRequest>({
    mutationFn: clearOrder,
  });
};
