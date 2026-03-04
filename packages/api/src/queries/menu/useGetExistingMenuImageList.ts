import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getExistingMenuImageList } from '../../fetchers/menu';
import { queryKeys } from '../queryKeys';
import type { TGetExistingMenuImageListResponse } from '../../types/menu';
import type { IApiError } from '../../types/common';

/**
 * 기존 메뉴 이미지 목록 조회 훅
 */
export const useGetExistingMenuImageList = (
  shopCode: string,
  options?: Omit<
    UseQueryOptions<TGetExistingMenuImageListResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetExistingMenuImageListResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.menu.existingImageList(shopCode),
    queryFn: () => getExistingMenuImageList(shopCode),
    ...options,
  });
};
