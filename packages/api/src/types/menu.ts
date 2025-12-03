import type { IApiResponse } from './common';

interface ICommonResponseData {
  index: number;
  isDeleted: boolean;
  mappedOptionGroupCode: string;
  mappedOptionGroupName: string;
  mappedHeadOptionGroupCode: string;
  mappedUptDt: string;
  isMapped: boolean;
  createDate: string;
  createMemberUuid: string;
  updateDate: string;
  updateMemberUuid: string;
}

type TLocale = Record<string, string> | null;

export interface IOption extends ICommonResponseData {
  optionSeq: number;
  optionGroupSeq: number;
  optionName: string;
  optionPrice: number;
  isOutOfStock: boolean;
  localeOptionName: TLocale;
  localeOptionNameStr: TLocale;
  quantity: number;
}

export interface IOptionGroup extends ICommonResponseData {
  optionGroupSeq: number;
  optionGroupName: string;
  menuSeq: number;
  requiredQuantity: number;
  isMultipleSelectable: boolean;
  isOptionQuantitySelectable: boolean;
  isMenuQuantityDependant: boolean;
  localeOptionGroupName: TLocale;
  localeOptionGroupNameStr: TLocale;
  optionList: IOption[];
}

// ============================================================================
// 이미지 타입
// ============================================================================

export interface IMenuImage {
  imageSeq: number;
  menuSeq: number;
  imagePath: string | null;
  imageName: string;
  imageExtension: string | null;
  imageIndex: number;
  isDeleted: boolean;
  isMainImage: boolean;
}

/**
 * 메뉴 생성 요청 시 사용하는 이미지 타입
 * - imageName: 파일명 (UUID 또는 timestamp)
 * - imageIndex: 이미지 순서
 * - isMainImage: 메인 이미지 여부
 */
export interface ICreateMenuImage {
  imageName: string;
  imageIndex: number;
  isMainImage: boolean;
}

// ============================================================================
// 메뉴 베이스 타입 (최소 단위)
// ============================================================================

/**
 * 메뉴 베이스 타입 (최소 단위)
 */
export interface IMenuBase {
  menuSeq: number; // POST 요청에서 제외
  menuName: string;
  categorySeq: number;
  menuPrice: number;
  isRecommended: boolean;
  menuDescription: string | null;
  isOutOfStock: boolean;
  index: number;
  isDeleted: boolean; // READ_ONLY (GET 응답에만 포함)
  mappedMenuCode: string | null;
  mappedMenuName: string | null; // READ_ONLY (GET 응답에만 포함)
  mappedCategoryCode: string | null; // READ_ONLY (GET 응답에만 포함)
  mappedOptionGroupCode: string | null; // READ_ONLY (GET 응답에만 포함)
  mappedOptionGroupCode2: string | null; // READ_ONLY (GET 응답에만 포함)
  mappedUptDt: string | null; // READ_ONLY (GET 응답에만 포함)
  isMapped: boolean; // READ_ONLY (GET 응답에만 포함)
  isHidden: boolean;
  isBest: boolean;
  isNew: boolean;
  spiceLevel: number;
  isTaxFree: boolean;
  minQuantity: number;
  touchKeyColorCode: string | null;
  localeMenuName: TLocale; // READ_ONLY (GET 응답에만 포함)
  localeMenuDescription: TLocale; // READ_ONLY (GET 응답에만 포함)
  createDate: string | null; // READ_ONLY (GET 응답에만 포함)
  createMemberUuid: string | null; // READ_ONLY (GET 응답에만 포함)
  updateDate: string | null; // READ_ONLY (GET 응답에만 포함)
  updateMemberUuid: string | null; // READ_ONLY (GET 응답에만 포함)
  optionGroupList: IOptionGroup[];
  localeMenuNameStr: string | null; // READ_ONLY (GET 응답에만 포함)
  localeMenuDescriptionStr: string | null; // READ_ONLY (GET 응답에만 포함)
  quantity: number; // CLIENT_ONLY
  selectedOptions: unknown[]; // CLIENT_ONLY
  totalPrice: number; // CLIENT_ONLY
  selectedLanguageCode: string | null;
  menuImageList: IMenuImage[] | null; // READ_ONLY (GET 응답에만 포함)
}

// ============================================================================
// 확장 타입 정의 (베이스 타입 확장)
// ============================================================================

/**
 * 메뉴 전체 타입 (베이스 타입 확장)
 */
export type IMenu = IMenuBase;

// ============================================================================
// GET /menu/list
// ============================================================================

export interface IGetMenuListParams {
  categorySeq: number;
}

export type TGetMenuListResponse = IApiResponse<IMenu[]>;

// ============================================================================
// POST /menu
// ============================================================================

/**
 * 메뉴 생성 요청 타입 POST
 * - menuSeq 제외
 * - READ_ONLY 필드 제외
 * - CLIENT_ONLY 필드 제외
 */
export type ICreateMenuRequest = Omit<
  IMenuBase,
  | 'menuSeq'
  | 'isDeleted'
  | 'mappedMenuName'
  | 'mappedCategoryCode'
  | 'mappedOptionGroupCode'
  | 'mappedOptionGroupCode2'
  | 'mappedUptDt'
  | 'isMapped'
  | 'localeMenuName'
  | 'localeMenuDescription'
  | 'createDate'
  | 'createMemberUuid'
  | 'updateDate'
  | 'updateMemberUuid'
  | 'localeMenuNameStr'
  | 'localeMenuDescriptionStr'
  | 'quantity'
  | 'selectedOptions'
  | 'totalPrice'
  | 'isOutOfStock'
  | 'index'
  | 'mappedMenuCode'
  | 'isHidden'
  | 'menuImageList'
> &
  Partial<
    Pick<
      IMenuBase,
      | 'mappedMenuCode'
      | 'menuDescription'
      | 'isRecommended'
      | 'isOutOfStock'
      | 'index'
      | 'isHidden'
      | 'isBest'
      | 'isNew'
      | 'spiceLevel'
      | 'isTaxFree'
      | 'minQuantity'
      | 'touchKeyColorCode'
      | 'optionGroupList'
      | 'selectedLanguageCode'
    >
  > & {
    menuImageList?: ICreateMenuImage[];
  };

// ============================================================================
// PUT /menu
// ============================================================================

/**
 * 메뉴 수정 요청 타입
 */
export type IUpdateMenuRequest = Omit<
  IMenu,
  | 'isDeleted'
  | 'mappedMenuName'
  | 'mappedCategoryCode'
  | 'mappedOptionGroupCode'
  | 'mappedOptionGroupCode2'
  | 'mappedUptDt'
  | 'isMapped'
  | 'localeMenuName'
  | 'localeMenuDescription'
  | 'createDate'
  | 'createMemberUuid'
  | 'updateDate'
  | 'updateMemberUuid'
  | 'localeMenuNameStr'
  | 'localeMenuDescriptionStr'
  | 'quantity'
  | 'selectedOptions'
  | 'totalPrice'
  | 'index'
> &
  Partial<
    Pick<
      IMenu,
      | 'menuDescription'
      | 'isRecommended'
      | 'isOutOfStock'
      | 'isHidden'
      | 'isBest'
      | 'isNew'
      | 'spiceLevel'
      | 'isTaxFree'
      | 'minQuantity'
      | 'touchKeyColorCode'
      | 'optionGroupList'
      | 'selectedLanguageCode'
    >
  >;

// ============================================================================
// DELETE /menu
// ============================================================================

export interface IDeleteMenuParams {
  menuSeq: number;
}
