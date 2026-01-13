import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import type {
  IGetNoticeListParams,
  TGetNoticeListResponse,
  TGetNoticeDetailResponse,
} from '../types/notice';

/**
 * 공지사항 목록을 조회합니다.
 * GET /notice/list
 */
export const getNoticeList = async (
  params: IGetNoticeListParams = { page: 1, pageSize: 20 }
): Promise<TGetNoticeListResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetNoticeListResponse>({
    method: 'GET',
    url: ENDPOINTS.NOTICE.LIST,
    params,
  });

  return response.data;
};

/**
 * 공지사항 상세 정보를 조회합니다.
 * GET /notice/{noticeSeq}
 */
export const getNoticeDetail = async (
  noticeSeq: number
): Promise<TGetNoticeDetailResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetNoticeDetailResponse>({
    method: 'GET',
    url: ENDPOINTS.NOTICE.DETAIL(noticeSeq),
  });

  return response.data;
};

/**
 * 공지사항 조회수를 증가시킵니다.
 * GET /notice/{noticeSeq}/view
 */
export const updateNoticeView = async (noticeSeq: number): Promise<void> => {
  const axiosInstance = getAxiosInstance('private');
  await axiosInstance({
    method: 'GET',
    url: ENDPOINTS.NOTICE.VIEW(noticeSeq),
  });
};
