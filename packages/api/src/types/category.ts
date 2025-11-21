import type { IApiResponse } from './common';

/**
 * 카테고리 정보 타입
 */
export interface ICategory {
  categorySeq: string;
  shopSeq: string;
  categoryName: string;
  index: string;
  isDeleted: boolean;
  isMapped: boolean; //무엇과 mapped?
  isHidden: boolean; //메뉴판에서 숨기기
  saleDayOfWeek: string; //판매 요일
  saleStartTime: string; //판매 시작 시간
  saleEndTime: string; //판매 종료 시간
  isSaleOnHoliday: string;
  useTwoColumnLayout: boolean;
  isQuantitySelectable: boolean;
  isStaffCall: boolean;
  categoryDescription: string;
  isFirstOrderRequired: boolean;
  localeCategoryName: string;
  localeCategoryDescription: string;
  createDate: string;
  updateDate: string;
  menuInfoList: unknown[];
  selectedLanguageCode: string;
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
