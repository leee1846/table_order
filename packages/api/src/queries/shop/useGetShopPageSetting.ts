import { queryKeys } from '../queryKeys';
import { getShopPageSetting } from '../../fetchers/shop';
import { TGetShopPageSettingResponse } from '../../types/shop';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { IApiError } from '../../types/common';

export const useGetShopPageSetting = (
  shopCode: string,
  options?: Omit<
    UseQueryOptions<TGetShopPageSettingResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetShopPageSettingResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.shop.pageSetting(shopCode),
    queryFn: () => getShopPageSetting(shopCode),
    ...options,
  });
};
