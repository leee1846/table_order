import { IApiResponse } from './common';

export type TManualType = 'ADMIN' | 'SHOP';

// 개별 매뉴얼 아이템 인터페이스
export interface IManualItem {
  manualSeq: number;
  manualFileName: string;
  manualType: TManualType;
  createDate: string; // Timestamp (ms)
  createMemberUuid: string;
  isDeleted: boolean;
}

// // API 공통 상태 구조
// export interface IApiResponseStatus {
//   code: number;
//   userMessage: string;
//   debugMessage: string;
// }

export interface IGetManualListParams {
  page?: number;
  pageSize?: number;
  searchWord?: string;
}

// 매뉴얼 목록 데이터 구조
export interface ManualListResponseData {
  currentPageNumber: number;
  totalPageNumber: number;
  totalCount: number;
  manualList: IManualItem[];
}

export type TGetManualListResponse = IApiResponse<ManualListResponseData>;
