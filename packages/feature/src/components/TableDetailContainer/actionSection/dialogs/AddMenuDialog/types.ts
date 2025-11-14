import type { MenuVo, OptionVo } from '../../../mock';

export interface SelectedOption extends OptionVo {
  selectedQuantity: number;
}

export interface SelectedMenuWithOptions {
  menu: MenuVo;
  selectedOptions: SelectedOption[];
  quantity: number;
}

export interface AddMenuDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tableName?: string;
  onAdd?: (selectedItems: SelectedMenuWithOptions[]) => void;
}

