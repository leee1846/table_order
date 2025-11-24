import type { IApiResponse } from './common';


export interface IMenu {
  menuSeq: number;
  menuName: string;
  categorySeq: number;
  menuPrice: number;
  isRecommended: boolean;
  menuDescription: string;
  isOutOfStock: boolean;
  index: number;
  mappedMenuCode: string;
  isMapped: boolean; //오케이 포스와 연동
  isHidden: boolean; //메뉴판에서 숨기기
  isBest: boolean; //메뉴판에서 베스트 메뉴로 표시
  isNew: boolean; //메뉴판에서 새로운 메뉴로 표시
  spiceLevel: number;
  isTaxFree: boolean;
  minQuantity: number;
  touchKeyColorCode: string;
  localeMenuName: Record<string, string> | null;
  createDate: string;
  updateDate: string;
  optionGroupList: unknown[];
}

//TODO useSaleDay, useSaleTime 값 추가
export interface ICategory {
  categorySeq: number;
  shopSeq: number;
  categoryName: string;
  index: number;
  mappedCategoryCode: string;
  isMapped: boolean; //오케이 포스와 연동
  isHidden: boolean; //메뉴판에서 숨기기
  saleDayOfWeek: number[]; //판매 요일
  useSaleTime: boolean;
  saleStartTime: string; //판매 시작 시간
  saleEndTime: string; //판매 종료 시간
  isSaleOnHoliday: boolean;
  useTwoColumnLayout: boolean;
  isQuantitySelectable: boolean;
  isStaffCall: boolean;
  categoryDescription: string;
  isFirstOrderRequired: boolean;
  isDeleted: boolean;
  localeCategoryName: string;
  localeCategoryDescription: string;
  createDate: string;
  updateDate: string;
  menuInfoList: IMenu[];
  selectedLanguageCode: 'KO' | 'JP' | 'CH' | 'EN' | null;
}

/**
 * 카테고리 리스트 조회 요청 파라미터 타입
 */
export interface IGetCategoryListParams {
  shopSeq: number;
}

/**
 * 카테고리 리스트 조회 응답 타입 (IApiResponse 래핑)
 */
export type TGetCategoryListResponse = IApiResponse<ICategory[]>;

/**
 * 카테고리 수정 응답 타입 (IApiResponse 래핑)
 */
export type TUpdateCategoryResponse = IApiResponse<null>;
