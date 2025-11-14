import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { sendPickupNotification } from '../../fetchers/orders';
import type {
  ISendPickupNotificationRequest,
  ISendPickupNotificationResponse,
} from '../../types/orders';

interface IPostPickupNotificationRequest {
  options?: Omit<
    UseMutationOptions<
      ISendPickupNotificationResponse,
      AxiosError,
      ISendPickupNotificationRequest
    >,
    'mutationFn'
  >;
}

//UseMutationResult<TData, TError, TVariables>
type TPostPickupNotificationResult = UseMutationResult<
  ISendPickupNotificationResponse,
  AxiosError,
  ISendPickupNotificationRequest
>;

/**
 * 픽업 알림을 전송하는 React Query Mutation Hook
 *
 * @param options - React Query Mutation 옵션
 * @returns 픽업 알림 전송 mutation 결과
 */

export const usePostPickupNotification = ({
  options,
}: IPostPickupNotificationRequest): TPostPickupNotificationResult => {
  return useMutation<
    ISendPickupNotificationResponse,
    AxiosError,
    ISendPickupNotificationRequest
  >({
    mutationFn: sendPickupNotification,
    ...options,
  });
};
