import { getShopThemeMenu } from '../../fetchers/shop';
import { queryKeys } from '../queryKeys';
import { TGetShopThemeMenuResponse } from '../../types/shop';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { IApiError } from '../../types/common';

export const useGetShopThemeMenu = (
  shopCode: string,
  options?: Omit<
    UseQueryOptions<TGetShopThemeMenuResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetShopThemeMenuResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.shop.themeMenu(shopCode),
    queryFn: () => getShopThemeMenu(shopCode),
    ...options,
  });
};
