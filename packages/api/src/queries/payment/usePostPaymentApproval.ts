import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { IPostPaymentApprovalRequestParams } from '../../types/payment';
import { IApiError, TVoidApiResponse } from '../../types/common';
import { postPaymentApproval } from '../../fetchers/payment';
import { IPaymentResponse } from '@repo/util/app';

export const usePostPaymentApproval = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    {
      params: IPostPaymentApprovalRequestParams;
      data: IPaymentResponse;
      ignoreGlobalErrors?: number[];
    }
  >({
    mutationFn: ({ params, data, ignoreGlobalErrors }) =>
      postPaymentApproval({ params, data, ignoreGlobalErrors }),
  });
};
