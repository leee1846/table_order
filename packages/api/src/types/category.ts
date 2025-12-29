import type { IApiResponse, TVoidApiResponse } from './common';
import { IMenu } from './menu';

// ============================================================================
// 언어 코드 타입
// ============================================================================

export type TLanguageCode = 'KO' | 'EN' | 'JP' | 'CH' | 'RU';

/**
 * 카테고리 베이스 타입 (최소 단위)
 */
export interface ICategoryBase {
  categorySeq: number; // POST 요청에서 제외
  shopSeq: number;
  categoryName: string;
  index: number;
  mappedCategoryCode: string | null;
  isMapped: boolean; // READ_ONLY (GET 응답에만 포함)
  isHidden: boolean;
  useSaleDay: boolean;
  saleDayOfWeek: number[] | null;
  useSaleTime: boolean;
  saleStartTime: string | null;
  saleEndTime: string | null;
  isSaleOnHoliday: boolean;
  useTwoColumnLayout: boolean;
  isQuantitySelectable: boolean;
  isStaffCall: boolean;
  categoryDescription: string | null;
  isFirstOrderRequired: boolean;
  localeCategoryName: Record<string, string> | null; // READ_ONLY (GET 응답에만 포함)
  localeCategoryDescription: Record<string, string> | null; // READ_ONLY (GET 응답에만 포함)
  createDate: string | null; // READ_ONLY (GET 응답에만 포함)
  updateDate: string | null; // READ_ONLY (GET 응답에만 포함)
  selectedLanguageCode: TLanguageCode;
}

// ============================================================================
// 확장 타입 정의 (베이스 타입 확장)
// ============================================================================

/**
 * 카테고리 전체 타입 (베이스 타입 확장)
 */
export interface ICategory extends ICategoryBase {
  menuInfoList: []; //일단 항상 빈 array로 넘겨준다고 함
}

// ============================================================================
// GET /category/list
// ============================================================================

export interface IGetCategoryListParams {
  shopSeq: number;
}

export type TGetCategoryListResponse = IApiResponse<ICategory[]>;

// ============================================================================
// POST /category
// ============================================================================

/**
 * 카테고리 생성 요청 타입 POST
 * - categorySeq 제외
 */
export type ICreateCategoryRequest = Omit<
  ICategoryBase,
  | 'categorySeq'
  | 'isMapped'
  | 'localeCategoryName'
  | 'localeCategoryDescription'
  | 'createDate'
  | 'updateDate'
  | 'index'
  | 'isHidden'
  | 'mappedCategoryCode'
> &
  Partial<
    Pick<
      ICategoryBase,
      | 'saleDayOfWeek'
      | 'saleStartTime'
      | 'saleEndTime'
      | 'categoryDescription'
      | 'selectedLanguageCode'
    >
  > & {
    menuInfoList?: [];
  };

// ============================================================================
// PUT /category
// ============================================================================

/**
 * 카테고리 수정 요청 타입
 */
export type IUpdateCategoryRequest = Omit<
  ICategory,
  | 'isMapped'
  | 'localeCategoryName'
  | 'localeCategoryDescription'
  | 'createDate'
  | 'updateDate'
> &
  Partial<
    Pick<
      ICategory,
      | 'mappedCategoryCode'
      | 'saleDayOfWeek'
      | 'saleStartTime'
      | 'saleEndTime'
      | 'categoryDescription'
      | 'selectedLanguageCode'
      | 'menuInfoList'
    >
  >;

// ============================================================================
// DELETE /category
// ============================================================================

export interface IDeleteCategoryParams {
  categorySeq: number;
}

// ============================================================================
// GET /menuboard/{shopCode}
// ============================================================================

export interface IGetShopCategoriesWithMenusParams {
  shopCode: string;
  tableNumber: string;
}

export interface ICategoryWithMenus extends ICategoryBase {
  isDeleted: boolean;
  mappedCategoryName: string;
  mappedUptDt: string;
  createMemberUuid: string;
  updateMemberUuid: string;
  menuInfoList: IMenu[];
  localeCategoryStr: string;
  localeCategoryDescriptionStr: string;
  selectedLanguageCode: TLanguageCode;
}

export type TGetShopCategoriesWithMenusResponse = IApiResponse<
  ICategoryWithMenus[]
>;

// ============================================================================
// PUT /category/index
// ============================================================================

/**
 * 카테고리 순번 수정 요청 타입
 * 변경된 카테고리 하나만 전송 (categorySeq와 index 포함)
 */
export interface IUpdateCategoryIndexRequest {
  categorySeq: number;
  index: number;
}

// ============================================================================
// PUT /category/hidden
// ============================================================================

/**
 * 카테고리 숨김 수정 요청 타입
 */
export interface IUpdateCategoryHiddenParams {
  categorySeq: number;
  isHidden: boolean;
}

// ============================================================================
// POST /category/except-table/{shopCode}
// ============================================================================

export interface ICategoryExceptTableRequest {
  shopCode: string;
  categorySeq: number;
  tableNumberList: string[];
}

export interface ITableBlackListRequest {
  tableNumberList: string[];
}

// ============================================================================
// PUT /category/first-order
// ============================================================================

export type TUpdateCategoryFirstOrderRequest = ICategory[];

export type TUpdateCategoryFirstOrderResponse = TVoidApiResponse;
