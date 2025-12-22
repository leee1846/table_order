import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import type {
  IGetNoticeListParams,
  TGetNoticeListResponse,
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
