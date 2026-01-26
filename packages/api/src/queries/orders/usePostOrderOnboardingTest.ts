import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { postOrderOnboardingTest } from '../../fetchers/orders';
import type { IApiError, TVoidApiResponse } from '../../types/common';

export const usePostOrderOnboardingTest = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    { shopCode: string }
  >({
    mutationFn: (params) => postOrderOnboardingTest(params.shopCode),
  });
};
