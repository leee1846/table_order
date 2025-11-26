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

export interface IMenuDetailResponse {
  menuSeq: number;
  menuName: string;
  categorySeq: number;
  menuPrice: number;
  isRecommended: boolean;
  menuDescription: string;
  isOutOfStock: boolean;
  index: number;
  mappedMenuCode: string;
  isHidden: boolean;
  isBest: boolean;
  isNew: boolean;
  spiceLevel: number;
  isTaxFree: boolean;
  minQuantity: number;
  touchKeyColorCode: string;
  optionGroupList: unknown[];
  quantity: number;
  selectedOptions: unknown[];
  totalPrice: number;
  selectedLanguageCode: string;
}

export type TCreateMenuResponse = IApiResponse<IMenuDetailResponse>;
