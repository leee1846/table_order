import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getNoticeDetail } from '../../fetchers/notice';
import { queryKeys } from '../queryKeys';
import type { TGetNoticeDetailResponse } from '../../types/notice';
import type { IApiError } from '../../types/common';

/**
 * 공지사항 상세 정보를 조회합니다.
 */
export const useGetNoticeDetail = (
  noticeSeq: number,
  options?: Omit<
    UseQueryOptions<TGetNoticeDetailResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetNoticeDetailResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.notice.detail(noticeSeq),
    queryFn: () => getNoticeDetail(noticeSeq),
    ...options,
  });
};

