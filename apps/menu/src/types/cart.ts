import type { TLocale } from '@repo/api/types';

export interface ICartOption {
  optionGroupSeq: number;
  optionSeq: number;
  optionName: string;
  optionPrice: number;
  quantity: number;
  localeOptionName: TLocale;
}

export interface ICartMenu {
  categorySeq: number;
  menuSeq: number;
  menuName: string;
  menuPrice: number;
  quantity: number;
  selectedOptions: ICartOption[];
  localeMenuName: TLocale;
}

export interface ICartMenuWithId extends ICartMenu {
  id: string;
}
