import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getSampleMenuImageList } from '../../fetchers/menu';
import { queryKeys } from '../queryKeys';
import type { TGetSampleMenuImageListResponse } from '../../types/menu';
import type { IApiError } from '../../types/common';

/**
 * 추천 메뉴 이미지 목록 조회 훅
 */
export const useGetSampleMenuImageList = (
  options?: Omit<
    UseQueryOptions<TGetSampleMenuImageListResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetSampleMenuImageListResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.menu.sampleImageList(),
    queryFn: () => getSampleMenuImageList(),
    ...options,
  });
};
