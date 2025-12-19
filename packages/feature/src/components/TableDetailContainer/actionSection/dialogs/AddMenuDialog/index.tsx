import { useEffect, useMemo, useState } from 'react';
import type {
  ICategoryWithMenus,
  IMenu,
  IOption,
  IOptionGroup,
} from '@repo/api/types';
import { toast } from '@repo/feature/utils';
import { MenuSelectionView } from './MenuSelectionView';
import { OptionSelectionView } from './OptionSelectionView';
import { validateOptionGroups } from './optionValidation';

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
  categories?: ICategoryWithMenus[];
  isCategoriesLoading?: boolean;
}

export const AddMenuDialog = ({
  isOpen,
  onClose,
  tableName = '테이블 이름',
  onAdd,
  categories = [],
  isCategoriesLoading = false,
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

  const menuboardCategories: ICategoryWithMenus[] = useMemo(() => {
    return categories || [];
  }, [categories]);

  const defaultCategorySeq = useMemo(() => {
    return menuboardCategories[0]?.categorySeq ?? null;
  }, [menuboardCategories]);

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
      // 옵션이 없으면 기존에 같은 메뉴가 있는지 확인
      setSelectedMenus((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.menu.menuSeq === menu.menuSeq
        );

        //findIndex -1
        if (existingIndex !== -1) {
          return prev.map((item, index) =>
            index === existingIndex
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          const menuWithOptions: SelectedMenuWithOptions = {
            menu,
            selectedOptions: [],
            quantity: 1,
          };
          return [...prev, menuWithOptions];
        }
      });
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

  // 두 SelectedOption 배열이 동일한지 비교하는 헬퍼 함수
  const areOptionsEqual = (
    options1: SelectedOption[],
    options2: SelectedOption[]
  ): boolean => {
    if (options1.length !== options2.length) {
      return false;
    }

    // 옵션을 optionSeq로 정렬하여 비교
    const sorted1 = [...options1].sort((a, b) => a.optionSeq - b.optionSeq);
    const sorted2 = [...options2].sort((a, b) => a.optionSeq - b.optionSeq);

    return sorted1.every((opt1, index) => {
      const opt2 = sorted2[index];
      return (
        opt2 !== undefined &&
        opt1.optionSeq === opt2.optionSeq &&
        opt1.selectedQuantity === opt2.selectedQuantity
      );
    });
  };

  // 옵션 추가 핸들러
  const handleAddOptions = () => {
    if (!selectedMenu) {
      return;
    }

    const validation = validateOptionGroups(
      selectedMenu.optionGroupList || [],
      selectedOptions
    );

    if (!validation.isValid) {
      const invalidResult = validation.results.find(
        (result) => !result.isValid
      );
      if (invalidResult?.message) {
        toast(invalidResult.message);
      } else {
        toast('옵션 선택 조건을 확인해주세요.');
      }
      return;
    }

    const selectedOptionsList: SelectedOption[] = [];

    selectedOptions.forEach((quantity, optionSeq) => {
      if (quantity > 0) {
        // 옵션 그룹에서 해당 옵션 찾기
        const option = selectedMenu.optionGroupList
          ?.flatMap((group) => group.optionList)
          .find((opt) => opt.optionSeq === optionSeq);

        if (option && !option.isOutOfStock && !option.isDeleted) {
          if (quantity === 0) {
            return;
          }

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

    // 기존에 동일한 메뉴와 옵션 조합이 있는지 확인
    setSelectedMenus((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.menu.menuSeq === selectedMenu.menuSeq &&
          areOptionsEqual(item.selectedOptions, selectedOptionsList)
      );

      if (existingIndex !== -1) {
        // 동일한 조합이 있으면 메뉴 수량과 옵션 수량 모두 증가

        return prev.map((item, index) => {
          if (index === existingIndex) {
            // 옵션 수량도 증가
            const updatedOptions = item.selectedOptions.map((existingOpt) => {
              const newOpt = selectedOptionsList.find(
                (opt) => opt.optionSeq === existingOpt.optionSeq
              );
              return newOpt
                ? {
                    ...existingOpt,
                    selectedQuantity:
                      existingOpt.selectedQuantity + newOpt.selectedQuantity,
                  }
                : existingOpt;
            });
            return {
              ...item,
              quantity: item.quantity + menuQuantity,
              selectedOptions: updatedOptions,
            };
          }
          return item;
        });
      } else {
        // 없으면 새로 추가
        return [...prev, menuWithOptions];
      }
    });

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
        categories={menuboardCategories}
        isLoading={isCategoriesLoading}
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
};
