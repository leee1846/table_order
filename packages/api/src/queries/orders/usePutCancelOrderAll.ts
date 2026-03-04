import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { cancelOrderAll } from '../../fetchers/orders';
import type { ICancelOrderAllRequest } from '../../types/orders';
import type { IApiError, TVoidApiResponse } from '../../types/common';

export const usePutCancelOrderAll = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    ICancelOrderAllRequest
  >({
    mutationFn: cancelOrderAll,
  });
};
