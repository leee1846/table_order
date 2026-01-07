import { createShop } from '../../fetchers/shop';
import { useMutation } from '@tanstack/react-query';
import { TVoidApiResponse, IApiError } from '../../types/common';
import type { ICreateShopRequest } from '../../types/shop';
import { AxiosError } from 'axios';

export const usePostShop = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    ICreateShopRequest
  >({
    mutationFn: createShop,
  });
};
