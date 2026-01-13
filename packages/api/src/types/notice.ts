import { IApiResponse } from './common';

export type TNoticeBoardType = 'GENERAL' | 'EMERGENCY';

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
  boardType: TNoticeBoardType | null;
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
  currentPageNumber: number;
  totalPage: number;
  noticeList: INotice[];
}

/**
 * 공지사항 상세 정보 (view 필드 포함)
 */
export interface INoticeDetail extends INotice {
  view: number;
}

/**
 * GET /notice/list 응답 타입
 */
export type TGetNoticeListResponse = IApiResponse<INoticeListData>;

/**
 * GET /notice/{noticeSeq} 응답 타입
 */
export type TGetNoticeDetailResponse = IApiResponse<INoticeDetail>;
