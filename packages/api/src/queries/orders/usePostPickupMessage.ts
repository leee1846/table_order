import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { postPickupMessage } from '../../fetchers/orders';
import type {
  IPostPickupMessageRequest,
  TPostPickupMessageResponse,
} from '../../types/orders';
import { IApiError } from '../../types/common';

/**
 * 픽업 메시지를 전송합니다.
 * POST /order/pickup/{shopCode}/{tableNumber}
 */
export const usePostPickupMessage = () => {
  return useMutation<
    TPostPickupMessageResponse,
    AxiosError<IApiError>,
    IPostPickupMessageRequest
  >({
    mutationFn: postPickupMessage,
  });
};
