import type { IApiResponse } from './common';

export interface IGetStoreListParams {
  page?: number;
  size?: number;
  keyword?: string; // 검색 파라미터명에 맞춰 수정하세요.
  ungrouped?: boolean;
}

export interface IStore {
  shopSeq: number;
  shopCode?: string;
  shopName?: string;
  address1?: string;
  // TODO: 실제 Swagger 응답 필드에 맞게 추가/수정하세요.
}

export interface IStoreListResponseData {
  content: IStore[];
  totalElements: number;
  page: number;
  size: number;
  totalPages: number;
}

export type TGetStoreListResponse = IApiResponse<IStoreListResponseData>;

// ============================================================================
// GET /store/search
// ============================================================================
export interface IPostStoreSearchParams extends IGetStoreListParams {
  shopCodes: string[]; // TODO: 검색 파라미터명에 맞춰 수정하세요.
}

export type TPostStoreSearchResponse = IApiResponse<IStoreListResponseData>; // 응답 형태가 list와 같다면 재사용 가능합니다.
