export interface ICartOption {
  optionGroupSeq: number;
  optionSeq: number;
  optionName: string;
  optionPrice: number;
  quantity: number;
  isMenuQuantityDependant: boolean;
}

export interface ICartMenu {
  categorySeq: number;
  menuSeq: number;
  menuName: string;
  menuPrice: number;
  quantity: number;
  selectedOptions: ICartOption[];
}
