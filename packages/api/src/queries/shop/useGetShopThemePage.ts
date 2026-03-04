import { type AxiosError } from 'axios';
import { getShopThemePage } from '../../fetchers/shop';
import { queryKeys } from '../queryKeys';
import { IApiError } from '../../types/common';
import { TGetShopThemePageResponse } from '../../types/shop';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

export const useGetShopThemePage = (
  shopCode: string,
  options?: Omit<
    UseQueryOptions<TGetShopThemePageResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetShopThemePageResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.shop.themePage(shopCode),
    queryFn: () => getShopThemePage(shopCode),
    ...options,
  });
};
