import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { postPayment } from '../../fetchers/payment';
import { IPostPaymentRequest } from '../../types/payment';
import { IApiError, TVoidApiResponse } from '../../types/common';

export const usePostPayment = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    IPostPaymentRequest
  >({
    mutationFn: postPayment,
  });
};
