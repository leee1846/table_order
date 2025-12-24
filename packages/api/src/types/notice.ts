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
 * 페이지네이션 정보를 포함한 공지사항 목록 데이터
 */
export interface INoticeListData {
  notices: INotice[];
  total?: number; // 전체 공지사항 개수 (API가 지원하는 경우)
}

/**
 * GET /notice/list 응답 타입
 */
export type TGetNoticeListResponse = IApiResponse<INotice[]>;
