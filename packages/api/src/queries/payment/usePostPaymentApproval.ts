import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { IPostPaymentApprovalRequestParams } from '../../types/payment';
import { IPaymentResponse } from '@repo/util/app';
import { IApiError, TVoidApiResponse } from '../../types/common';
import { postPaymentApproval } from '../../fetchers/payment';

export const usePostPaymentApproval = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    {
      params: IPostPaymentApprovalRequestParams;
      data: IPaymentResponse;
    }
  >({
    mutationFn: ({ params, data }) => postPaymentApproval({ params, data }),
  });
};
