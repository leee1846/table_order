import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { postCustomAmount } from '../../fetchers/orders';
import type { IPostCustomAmountRequest } from '../../types/orders';
import type { IApiError, TVoidApiResponse } from '../../types/common';

export const usePostCustomAmount = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    IPostCustomAmountRequest
  >({
    mutationFn: postCustomAmount,
  });
};
