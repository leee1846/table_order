import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { cancelOrderMenu } from '../../fetchers/orders';
import type { ICancelOrderMenuRequest } from '../../types/orders';
import type { IApiError, TVoidApiResponse } from '../../types/common';

export const usePutCancelOrderMenu = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    ICancelOrderMenuRequest
  >({
    mutationFn: cancelOrderMenu,
  });
};
