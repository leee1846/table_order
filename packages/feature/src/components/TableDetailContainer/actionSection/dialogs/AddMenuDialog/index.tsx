import { useState } from 'react';
import { mockCategories, type MenuVo } from '../../../mock';
import type {
  AddMenuDialogProps,
  SelectedMenuWithOptions,
  SelectedOption,
} from './types';
import { MenuSelectionView } from './MenuSelectionView';
import { OptionSelectionView } from './OptionSelectionView';

export const AddMenuDialog = ({
  isOpen,
  onClose,
  tableName = '테이블 이름',
  onAdd,
}: AddMenuDialogProps) => {
  const [viewMode, setViewMode] = useState<'menu' | 'option'>('menu');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    mockCategories[0]?.categorySeq || ''
  );
  const [selectedMenu, setSelectedMenu] = useState<MenuVo | null>(null);
  const [selectedMenus, setSelectedMenus] = useState<SelectedMenuWithOptions[]>(
    []
  );
  const [selectedOptions, setSelectedOptions] = useState<Map<string, number>>(
    new Map()
  );
  const [menuQuantity, setMenuQuantity] = useState<number>(1);

  // 옵션 수량 변경 핸들러
  const handleOptionQuantityChange = (optionSeq: string, quantity: number) => {
    setSelectedOptions((prev) => {
      const newMap = new Map(prev);
      if (quantity > 0) {
        newMap.set(optionSeq, quantity);
      } else {
        newMap.delete(optionSeq);
      }
      return newMap;
    });
  };

  // 메뉴 클릭 핸들러 - 옵션이 없으면 바로 추가, 있으면 옵션 화면으로 전환
  const handleMenuClick = (menu: MenuVo) => {
    // 옵션이 없는 메뉴인지 확인
    const hasOptions =
      menu.optionGroupList &&
      menu.optionGroupList.length > 0 &&
      menu.optionGroupList.some(
        (group) => group.optionList && group.optionList.length > 0
      );

    if (!hasOptions) {
      // 옵션이 없으면 바로 RightPanel에 추가
      const menuWithOptions: SelectedMenuWithOptions = {
        menu,
        selectedOptions: [],
        quantity: 1,
      };
      setSelectedMenus((prev) => [...prev, menuWithOptions]);
    } else {
      // 옵션이 있으면 옵션 선택 화면으로 전환
      setSelectedMenu(menu);
      setSelectedOptions(new Map());
      setMenuQuantity(1);
      setViewMode('option');
    }
  };

  // 옵션 화면에서 뒤로가기
  const handleBackToMenu = () => {
    setViewMode('menu');
    setSelectedMenu(null);
    setSelectedOptions(new Map());
    setMenuQuantity(1);
  };

  // 옵션 추가 핸들러
  const handleAddOptions = () => {
    if (!selectedMenu) {
      return;
    }

    const selectedOptionsList: SelectedOption[] = [];
    selectedOptions.forEach((quantity, optionSeq) => {
      if (quantity > 0) {
        // 옵션 그룹에서 해당 옵션 찾기
        const option = selectedMenu.optionGroupList
          ?.flatMap((group) => group.optionList)
          .find((opt) => opt.optionSeq === optionSeq);

        if (option) {
          selectedOptionsList.push({
            ...option,
            selectedQuantity: quantity,
          });
        }
      }
    });

    const menuWithOptions: SelectedMenuWithOptions = {
      menu: selectedMenu,
      selectedOptions: selectedOptionsList,
      quantity: menuQuantity,
    };

    setSelectedMenus((prev) => [...prev, menuWithOptions]);
    handleBackToMenu();
  };

  // 아이템 삭제 핸들러
  const handleRemoveItem = (index: number) => {
    setSelectedMenus((prev) => prev.filter((_, i) => i !== index));
  };

  // 아이템 수량 변경 핸들러
  const handleItemQuantityChange = (index: number, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(index);
      return;
    }
    setSelectedMenus((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // 최종 추가 핸들러
  const handleAdd = () => {
    if (selectedMenus.length > 0) {
      onAdd?.(selectedMenus);
    }
    handleClose();
  };

  const handleClose = () => {
    setSelectedMenus([]);
    setSelectedCategory(mockCategories[0]?.categorySeq || '');
    setSelectedMenu(null);
    setSelectedOptions(new Map());
    setMenuQuantity(1);
    setViewMode('menu');
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  // 메뉴 선택 화면
  if (viewMode === 'menu') {
    return (
      <MenuSelectionView
        selectedCategory={selectedCategory}
        selectedMenus={selectedMenus}
        tableName={tableName}
        onCategoryChange={setSelectedCategory}
        onMenuClick={handleMenuClick}
        onAdd={handleAdd}
        onClose={handleClose}
        onRemoveItem={handleRemoveItem}
        onItemQuantityChange={handleItemQuantityChange}
      />
    );
  }

  // 옵션 선택 화면
  if (viewMode === 'option' && selectedMenu) {
    return (
      <OptionSelectionView
        selectedMenu={selectedMenu}
        selectedOptions={selectedOptions}
        menuQuantity={menuQuantity}
        onOptionQuantityChange={handleOptionQuantityChange}
        onMenuQuantityChange={setMenuQuantity}
        onAdd={handleAddOptions}
        onBack={handleBackToMenu}
      />
    );
  }

  return null;
};
