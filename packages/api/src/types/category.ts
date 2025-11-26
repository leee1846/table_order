import type { IApiResponse } from './common';

// ============================================================================
// 언어 코드 타입
// ============================================================================

export type TLanguageCode = 'KO' | 'EN' | 'JP' | 'CH';

// ============================================================================
// 베이스 타입 정의 (최소 단위, hidden = true 필드 제외)
// ============================================================================

/**
 * 메뉴 베이스 타입 (최소 단위)
 */
export interface IMenuBase {
  menuSeq: number;
  menuName: string;
  categorySeq: number;
  menuPrice: number;
  isRecommended: boolean;
  menuDescription: string | null;
  isOutOfStock: boolean;
  index: number;
  mappedMenuCode: string | null;
  isMapped: boolean; // READ_ONLY (GET 응답에만 포함)
  isHidden: boolean;
  isBest: boolean;
  isNew: boolean;
  spiceLevel: number;
  isTaxFree: boolean;
  minQuantity: number;
  touchKeyColorCode: string | null;
  localeMenuName: Record<string, string> | null; // READ_ONLY (GET 응답에만 포함)
  createDate: string | null; // READ_ONLY (GET 응답에만 포함)
  updateDate: string | null; // READ_ONLY (GET 응답에만 포함)
}

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
  selectedLanguageCode: TLanguageCode | null;
}

// ============================================================================
// 확장 타입 정의 (베이스 타입 확장)
// ============================================================================

/**
 * 메뉴 전체 타입 (베이스 타입 확장)
 */
export interface IMenu extends IMenuBase {
  optionGroupList: unknown[];
}

/**
 * 카테고리 전체 타입 (베이스 타입 확장)
 */
export interface ICategory extends ICategoryBase {
  menuInfoList: IMenu[];
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
 * - categorySeq 제외 (HttpMethodVisibility hiddenOn POST)
 */
export type ICreateCategoryRequest = Omit<
  ICategoryBase,
  | 'categorySeq'
  | 'isMapped'
  | 'localeCategoryName'
  | 'localeCategoryDescription'
  | 'createDate'
  | 'updateDate'
> &
  Partial<
    Pick<
      ICategoryBase,
      | 'mappedCategoryCode'
      | 'saleDayOfWeek'
      | 'saleStartTime'
      | 'saleEndTime'
      | 'categoryDescription'
      | 'selectedLanguageCode'
    >
  > & {
    menuInfoList?: IMenu[];
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
// 공통 Mutation Response (POST, PUT, DELETE 모두 동일한 응답 구조)
// ============================================================================

export type TCategoryMutationResponse = IApiResponse<null>;
