import { CheckButton } from '@repo/ui/components';
import * as S from '@/pages/MainPage/SplitPaymentModal/MenuSelector/menuSelector.style';
import { css } from '@emotion/react';
import { useState } from 'react';
import { OptionDetailModal } from '@/pages/MainPage/SplitPaymentModal/MenuSelector/OptionDetailModal';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import type { ICartMenuWithId } from '@/types/cart';
import { formatCurrency } from '@repo/util/string';
import { calculateMenuTotalPrice } from '@/utils/calculation';

interface Props {
  menus: ICartMenuWithId[];
  selectedMenus: ICartMenuWithId[];
  setSelectedMenus: (menus: ICartMenuWithId[]) => void;
}

export const MenuSelector = ({
  menus,
  selectedMenus,
  setSelectedMenus,
}: Props) => {
  const { t } = useCustomerTranslation();

  const [optionDetailMenuId, setOptionDetailMenuId] = useState<string | null>(
    null
  );

  const calculateMenuPrice = (menu: ICartMenuWithId): number => {
    const options = menu.selectedOptions.map((option) => ({
      optionPrice: option.optionPrice,
      quantity: option.quantity,
    }));

    return calculateMenuTotalPrice(menu.menuPrice, menu.quantity, options);
  };

  const isMenuSelected = (menu: ICartMenuWithId): boolean => {
    return selectedMenus.some((selected) => selected.id === menu.id);
  };

  const handleMenuSelectionChange = (
    checked: boolean,
    menu: ICartMenuWithId
  ) => {
    if (checked) {
      setSelectedMenus([...selectedMenus, menu]);
    } else {
      setSelectedMenus(
        selectedMenus.filter((selected) => selected.id !== menu.id)
      );
    }
  };

  const handleOptionDetailClick = (
    e: React.MouseEvent<HTMLDivElement>,
    menuId: string
  ) => {
    e.stopPropagation();
    setOptionDetailMenuId(menuId);
  };

  return (
    <>
      <S.SelectedMenuContainer>
        <p>{t('선택한 메뉴')}</p>
        <p>
          <span>{t('{{count}}개', { count: selectedMenus.length })}</span>/
          {t('{{count}}개', { count: menus.length })}
        </p>
      </S.SelectedMenuContainer>

      <S.MenuList>
        {menus.map((menu, index) => {
          const menuPrice = calculateMenuPrice(menu);
          const isSelected = isMenuSelected(menu);

          return (
            <S.MenuItem
              key={`${menu.menuSeq}-${index + 1}`}
              isSelected={isSelected}
            >
              <button type="button">
                <CheckButton
                  checked={isSelected}
                  onChange={(checked) =>
                    handleMenuSelectionChange(checked, menu)
                  }
                  customStyle={css`
                    & > div {
                      width: 28px;
                      height: 28px;
                    }
                  `}
                >
                  <S.MenuName>{menu.menuName}</S.MenuName>
                </CheckButton>
                <S.ButtonRightContainer>
                  <p>
                    {t('{{amount}}원', {
                      amount: formatCurrency(menuPrice),
                    })}
                  </p>
                  {menu.selectedOptions.length > 0 && (
                    <div onClick={(e) => handleOptionDetailClick(e, menu.id)}>
                      {t('옵션')}
                    </div>
                  )}
                </S.ButtonRightContainer>
              </button>
            </S.MenuItem>
          );
        })}
      </S.MenuList>

      {optionDetailMenuId && (
        <OptionDetailModal
          menu={menus.find((menu) => menu.id === optionDetailMenuId)}
          onClose={() => setOptionDetailMenuId(null)}
        />
      )}
    </>
  );
};
