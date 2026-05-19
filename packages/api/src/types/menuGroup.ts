import type { IApiResponse, TVoidApiResponse } from './common';

// ============================================================================
// GET /menu-group/list
// ============================================================================

/**
 * 메뉴 그룹 리스트 조회 파라미터
 */
export interface IGetMenuGroupListParams {
  page?: number;
  size?: number;
  name?: string;
}

/**
 * 메뉴 그룹 단일 아이템 정보
 */
export interface IMenuGroup {
  menuGroupSeq: number;
  menuGroupTag?: string;
  menuGroupName?: string;
  menus?: IMenuGroupMenu[];
  createDate?: string;
}

export interface IMenuGroupListResponseData {
  content: IMenuGroup[];
  totalElements: number;
  page: number;
  size: number;
  totalPages: number;
}

export type TGetMenuGroupListResponse =
  IApiResponse<IMenuGroupListResponseData>;

// ============================================================================
// POST /menu-groups
// ============================================================================

export interface ICreateMenuGroupRequest {
  menuGroupName: string;
  menus: number[];
}

// ============================================================================
// GET /menu-group/{menuGroupSeq}/menus (list_2)
// ============================================================================

/**
 * 메뉴 그룹에 포함된 메뉴 정보
 */
export interface IMenuGroupMenu {
  // TODO: 실제 Swagger 응답 필드에 맞게 추가/수정하세요.
  menuSeq: number;
  sortSeq: number;
  menuName: string;
  menuPrice: number;
  isRecommended: boolean;
  menuDescription: string;
}

export type TGetMenuGroupMenuListResponse = IApiResponse<IMenuGroupMenu[]>;

// ============================================================================
// PUT /menu-groups/{menuGroupSeq} (update_1)
// ============================================================================

export interface IUpdateMenuGroupRequest {
  menuGroupSeq: number; // Path Parameter용 (필요에 따라 수정)
  menuGroupName?: string;
  menus?: number[];
  isDeleted?: boolean;
}
