import { useMutation } from '@tanstack/react-query';
import { TVoidApiResponse, IApiError } from '../../types/common';
import { AxiosError } from 'axios';
import { createAdminShop } from '../../fetchers/admin';
import { ICreateShopRequest } from '../../types/shop';

export const usePostAdminShop = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    ICreateShopRequest
  >({
    mutationFn: createAdminShop,
  });
};
