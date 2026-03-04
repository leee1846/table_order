import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { sendPickupNotification } from '../../fetchers/orders';
import type {
  ISendPickupNotificationRequest,
  TSendPickupNotificationResponse,
} from '../../types/orders';
import { IApiError } from '../../types/common';

/**
 * 픽업 알림을 전송합니다.
 */
export const usePostPickupNotification = () => {
  return useMutation<
    TSendPickupNotificationResponse,
    AxiosError<IApiError>,
    ISendPickupNotificationRequest
  >({
    mutationFn: sendPickupNotification,
  });
};
