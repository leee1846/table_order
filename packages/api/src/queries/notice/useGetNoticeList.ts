import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getNoticeList } from '../../fetchers/notice';
import { queryKeys } from '../queryKeys';
import type {
  IGetNoticeListParams,
  TGetNoticeListResponse,
} from '../../types/notice';
import type { IApiError } from '../../types/common';

/**
 * 공지사항 목록을 조회합니다.
 */
export const useGetNoticeList = (
  params: IGetNoticeListParams,
  options?: Omit<
    UseQueryOptions<TGetNoticeListResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetNoticeListResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.notice.list(
      params.page,
      params.pageSize,
      params.searchWord
    ),
    queryFn: () => getNoticeList(params),
    ...options,
  });
};
