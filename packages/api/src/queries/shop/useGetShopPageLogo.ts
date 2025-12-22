import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getShopPageLogo } from '../../fetchers/shop';
import { queryKeys } from '../queryKeys';
import { TGetShopPageLogoResponse } from '../../types/shop';
import type { IApiError } from '../../types/common';

export const useGetShopPageLogo = (
  shopCode: string,
  options?: Omit<
    UseQueryOptions<TGetShopPageLogoResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetShopPageLogoResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.shop.pageLogo(shopCode),
    queryFn: () => getShopPageLogo(shopCode),
    ...options,
  });
};
