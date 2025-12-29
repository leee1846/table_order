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

  const [selectedOptionMenuId, setSelectedOptionMenuId] = useState<
    string | null
  >(null);

  const onClickOptionDetail = (
    e: React.MouseEvent<HTMLDivElement>,
    menuId: string
  ) => {
    e.stopPropagation();
    setSelectedOptionMenuId(menuId);
  };

  const onCheckButtonChange = (checked: boolean, menu: ICartMenuWithId) => {
    if (checked) {
      setSelectedMenus([...selectedMenus, menu]);
    } else {
      setSelectedMenus(
        selectedMenus.filter((selectedMenu) => selectedMenu.id !== menu.id)
      );
    }
  };

  const isMenuSelected = (menu: ICartMenuWithId) => {
    return selectedMenus.some((selectedMenu) => selectedMenu.id === menu.id);
  };

  const calculateMenuPrice = (menu: ICartMenuWithId): number => {
    const options = menu.selectedOptions.map((option) => ({
      optionPrice: option.optionPrice,
      quantity: option.quantity,
    }));

    return calculateMenuTotalPrice(menu.menuPrice, menu.quantity, options);
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
        {menus.map((menu, index) => (
          <S.MenuItem
            key={`${menu.menuSeq}-${index + 1}`}
            isSelected={isMenuSelected(menu)}
          >
            <button type="button">
              <CheckButton
                checked={isMenuSelected(menu)}
                onChange={(checked) => onCheckButtonChange(checked, menu)}
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
                    amount: formatCurrency(calculateMenuPrice(menu)),
                  })}
                </p>
                {menu.selectedOptions.length > 0 && (
                  <div onClick={(e) => onClickOptionDetail(e, menu.id)}>
                    {t('옵션')}
                  </div>
                )}
              </S.ButtonRightContainer>
            </button>
          </S.MenuItem>
        ))}
      </S.MenuList>

      {selectedOptionMenuId && (
        <OptionDetailModal
          menu={menus.find((menu) => menu.id === selectedOptionMenuId)}
          onClose={() => setSelectedOptionMenuId(null)}
        />
      )}
    </>
  );
};
