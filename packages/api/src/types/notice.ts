import { IApiResponse } from './common';

/**
 * 공지사항 정보
 */
export interface INotice {
  noticeSeq: number;
  noticeTitle: string;
  noticeContent: string;
  createDate: string;
  createMemberUuid: string | null;
  updateDate: string;
  updateMemberUuid: string | null;
  isDeleted: boolean;
  boardType: string | null;
  views: number;
}

/**
 * 공지사항 목록 조회 파라미터
 */
export interface IGetNoticeListParams {
  page?: number;
  pageSize?: number;
}

/**
 * GET /notice/list 응답 타입
 */
export type TGetNoticeListResponse = IApiResponse<INotice[]>;
