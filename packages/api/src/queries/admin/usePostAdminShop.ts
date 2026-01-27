import { useMutation } from '@tanstack/react-query';
import { TVoidApiResponse, IApiError } from '../../types/common';
import { AxiosError } from 'axios';
import { createAdminShop } from '../../fetchers/admin';
import { IGetAdminShopDetail } from '../../types/admin';

export const usePostAdminShop = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    IGetAdminShopDetail
  >({
    mutationFn: createAdminShop,
  });
};
