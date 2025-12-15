import { useEffect, useMemo, useState } from 'react';
import { useGetCategoriesWithMenus } from '@repo/api/queries';
import type { ICategoryWithMenus, IMenu, IOption } from '@repo/api/types';
import { MenuSelectionView } from './MenuSelectionView';
import { OptionSelectionView } from './OptionSelectionView';

export interface SelectedOption extends IOption {
  selectedQuantity: number;
}

export interface SelectedMenuWithOptions {
  menu: IMenu;
  selectedOptions: SelectedOption[];
  quantity: number;
}

interface AddMenuDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tableName?: string;
  onAdd?: (selectedItems: SelectedMenuWithOptions[]) => void;
  shopCode: string;
  tableNumber: number;
}

export const AddMenuDialog = ({
  isOpen,
  onClose,
  tableName = '테이블 이름',
  onAdd,
  shopCode,
  tableNumber,
}: AddMenuDialogProps) => {
  const [viewMode, setViewMode] = useState<'menu' | 'option'>('menu');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<IMenu | null>(null);
  const [selectedMenus, setSelectedMenus] = useState<SelectedMenuWithOptions[]>(
    []
  );
  const [selectedOptions, setSelectedOptions] = useState<Map<number, number>>(
    new Map()
  );
  const [menuQuantity, setMenuQuantity] = useState<number>(1);

  const { data: menuboardResponse, isLoading } = useGetCategoriesWithMenus(
    {
      shopCode,
      tableNumber,
    },
    {
      enabled: isOpen && !!shopCode && !!tableNumber,
    }
  );

  const categories: ICategoryWithMenus[] = useMemo(() => {
    return menuboardResponse?.data ?? [];
  }, [menuboardResponse]);

  const defaultCategorySeq = useMemo(() => {
    return categories[0]?.categorySeq ?? null;
  }, [categories]);

  useEffect(() => {
    if (isOpen && defaultCategorySeq !== null) {
      setSelectedCategory(defaultCategorySeq);
    }
  }, [defaultCategorySeq, isOpen]);

  // 옵션 수량 변경 핸들러
  const handleOptionQuantityChange = (optionSeq: number, quantity: number) => {
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
  const handleMenuClick = (menu: IMenu) => {
    // 옵션이 없는 메뉴인지 확인
    const hasOptions =
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
    setSelectedCategory(defaultCategorySeq);
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
        categories={categories}
        isLoading={isLoading}
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
