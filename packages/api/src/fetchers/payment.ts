import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import { IPostPaymentRequest } from '../types/payment';
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
