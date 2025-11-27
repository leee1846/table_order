import type { IApiResponse } from './common';

export interface ICreateMenuRequest {
  categorySeq: number;
  menuName: string;
  menuPrice: number;
  isRecommended?: boolean;
  menuDescription?: string;
  isOutOfStock?: boolean;
  index?: number;
  mappedMenuCode?: string;
  isHidden?: boolean;
  isBest?: boolean;
  isNew?: boolean;
  spiceLevel?: number;
  isTaxFree?: boolean;
  minQuantity?: number;
  touchKeyColorCode?: string;
  optionGroupList?: unknown[];
  quantity?: number;
  selectedOptions?: unknown[];
  totalPrice?: number;
  selectedLanguageCode?: string;
}

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

export interface IMenuListItem {
  menuSeq: number;
  menuName: string;
  categorySeq: number;
  menuPrice: number;
  isRecommended: boolean;
  menuDescription: string | null;
  isOutOfStock: boolean;
  index: number;
  isDeleted: boolean;
  mappedMenuCode: string | null;
  mappedMenuName: string | null;
  mappedCategoryCode: string | null;
  mappedOptionGroupCode: string | null;
  mappedOptionGroupCode2: string | null;
  mappedUptDt: string | null;
  isMapped: boolean;
  isHidden: boolean;
  isBest: boolean;
  isNew: boolean;
  spiceLevel: number;
  isTaxFree: boolean;
  minQuantity: number;
  touchKeyColorCode: string | null;
  localeMenuName: Record<string, string> | null;
  localeMenuDescription: Record<string, string> | null;
  createDate: string | null;
  createMemberUuid: string | null;
  updateDate: string | null;
  updateMemberUuid: string | null;
  optionGroupList: unknown[];
  localeMenuNameStr: string | null;
  localeMenuDescriptionStr: string | null;
  quantity: number;
  selectedOptions: unknown[];
  totalPrice: number;
  selectedLanguageCode: string | null;
  menuImageList: IMenuImage[] | null;
}

export type IMenuDetailResponse = IMenuListItem;

export interface IGetMenuListParams {
  categorySeq: number;
}

export type TGetMenuListResponse = IApiResponse<IMenuListItem[]>;

export type TCreateMenuResponse = IApiResponse<IMenuDetailResponse>;
