import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { getMenuBulkImageList } from '../../fetchers/menu';
import type {
  IApiError,
  TGetMenuBulkImageListResponse,
} from '../../types/common';

/**
 * 메뉴 대표 이미지 목록 조회 훅
 * GET /menu/bulk/image-list/{shopCode}
 */
export const useGetMenuBulkImageList = (
  shopCode: string,
  options?: Omit<
    UseQueryOptions<TGetMenuBulkImageListResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetMenuBulkImageListResponse, AxiosError<IApiError>>({
    queryKey: ['menu', 'bulkImageList', shopCode],
    queryFn: () => getMenuBulkImageList(shopCode),
    ...options,
  });
};
