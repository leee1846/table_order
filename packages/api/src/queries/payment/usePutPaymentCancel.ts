import { AxiosError } from 'axios';
import { IPutPaymentCancelRequestParams } from '../../types/payment';
import { useMutation } from '@tanstack/react-query';
import { TVoidApiResponse, IApiError } from '../../types/common';
import { IPaymentResponse } from '@repo/util/app';
import { putPaymentCancel } from '../../fetchers/payment';

export const usePutPaymentCancel = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    {
      params: IPutPaymentCancelRequestParams;
      data: IPaymentResponse;
      ignoreGlobalErrors?: number[];
    }
  >({
    mutationFn: ({ params, data, ignoreGlobalErrors }) =>
      putPaymentCancel({ params, data, ignoreGlobalErrors }),
  });
};
