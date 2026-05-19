import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { TGetMenuAdFilesResponse } from '../../types/menu';
import { AxiosError } from 'axios';
import { IApiError } from '../../types/common';
import { getMenuAdFiles } from '../../fetchers/menu';

export const useGetMenuAdFiles = (
  shopCode: string,
  options?: Omit<
    UseQueryOptions<TGetMenuAdFilesResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetMenuAdFilesResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.menu.adFiles(shopCode),
    queryFn: () => getMenuAdFiles(shopCode),
    ...options,
  });
};
