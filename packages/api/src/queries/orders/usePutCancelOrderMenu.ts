import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { cancelOrderMenu } from '../../fetchers/orders';
import type {
  ICancelOrderMenuRequest,
  TCancelOrderMenuResponse,
} from '../../types/orders';
import type { IApiError } from '../../types/common';

export const usePutCancelOrderMenu = () => {
  return useMutation<
    TCancelOrderMenuResponse,
    AxiosError<IApiError>,
    ICancelOrderMenuRequest
  >({
    mutationFn: cancelOrderMenu,
  });
};
