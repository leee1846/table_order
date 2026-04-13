import type { IApiResponse, TVoidApiResponse } from './common';

export interface IGetStoreGroupListParams {
  page?: number;
  size?: number;
  name?: string;
}

export interface IStoreGroup {
  storeGroupSeq: number;
  storeGroupId?: string;
  groupName?: string;
  groupDescription?: string;
  storeCount?: number;
  createDate?: string;
}

export interface IStoreGroupListResponseData {
  content: IStoreGroup[];
  totalElements: number;
  page: number;
  size: number;
  totalPages: number;
}

export type TGetStoreGroupListResponse =
  IApiResponse<IStoreGroupListResponseData>;

// ============================================================================
// POST /store-groups
// ============================================================================
export interface ICreateStoreGroupRequest {
  groupName: string;
  groupDescription?: string;
  stores?: string[];
}

// ============================================================================
// PUT /store-groups
// ============================================================================
export interface IUpdateStoreGroupRequest {
  storeGroupSeq: number;
  groupName?: string;
  groupDescription?: string;
  stores?: number[];
  isDeleted?: boolean;
}

// ============================================================================
// GET /store-groups/{id}
// ============================================================================
export interface IStoreGroupDetail extends IStoreGroup {
  stores?: string[]; // TODO: 백엔드 응답명에 맞춰 필드를 추가/수정하세요.
  [key: string]: any;
}

export type TGetStoreGroupDetailResponse = IApiResponse<IStoreGroupDetail>;

// ============================================================================
// GET /store-groups/{storeGroupSeq}/stores
// ============================================================================

export interface IStoreGroupMemberResponseData {
  content: IStoreGroupMember[];
  totalCount?: number;
  page?: number;
  size?: number;
  totalPages?: number;
}

export interface IStoreGroupMember {
  shopSeq: number;
  shopName: string;
  shopCode: string;
  address1: string;
  //   address2: string;
  //   shopPhoneNumber: string;
  //   ownerName: string;
  //   shopType: string;
}

export type TGetStoreGroupMembersResponse =
  IApiResponse<IStoreGroupMemberResponseData>;
