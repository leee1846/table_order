import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import {
  IPostPaymentRequest,
  IPostPaymentApprovalRequestParams,
} from '../types/payment';
import { IPaymentResponse } from '@repo/util/app';
import { TVoidApiResponse } from '../types/common';

export const postPayment = async (
  data: IPostPaymentRequest
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'POST',
    url: ENDPOINTS.PAYMENT.PAYMENT,
    data,
  });

  return response.data;
};

export const postPaymentApproval = async ({
  params,
  data,
  ignoreGlobalErrors,
}: {
  params: IPostPaymentApprovalRequestParams;
  data: IPaymentResponse;
  ignoreGlobalErrors?: number[];
}): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'POST',
    url: ENDPOINTS.PAYMENT.APPROVAL_METHOD_CODE(params.paymentMethodCode),
    params: {
      orderGroupUuid: params.orderGroupUuid,
      orderUuid: params.orderUuid,
    },
    data,
    ignoreGlobalErrors,
  });

  return response.data;
};
