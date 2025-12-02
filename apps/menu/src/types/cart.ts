export interface ICartOption {
  isMenuQuantityDependant: boolean;
  optionSeq: number;
  optionName: string;
  optionPrice: number;
  index: number;
  quantity: number;
}

export interface ICartMenu {
  categorySeq: number;
  menuSeq: number;
  menuName: string;
  menuPrice: number;
  quantity: number;
  selectedOptions: ICartOption[];
}
