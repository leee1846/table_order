import { updateAdminShop } from '../../fetchers/admin';
import { useMutation } from '@tanstack/react-query';
import type { TVoidApiResponse, IApiError } from '../../types/common';
import { AxiosError } from 'axios';
import type { IGetAdminShopDetail } from '../../types/admin';

export const usePutAdminShop = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    IGetAdminShopDetail
  >({
    mutationFn: updateAdminShop,
  });
};
