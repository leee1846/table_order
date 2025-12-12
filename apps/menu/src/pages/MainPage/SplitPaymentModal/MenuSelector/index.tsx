import { CheckButton } from '@repo/ui/components';
import * as S from '@/pages/MainPage/SplitPaymentModal/MenuSelector/menuSelector.style';
import { css } from '@emotion/react';
import { useState } from 'react';
import { OptionDetailModal } from '@/pages/MainPage/SplitPaymentModal/MenuSelector/OptionDetailModal';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import type { ICartMenuWithId } from '@/types/cart';
import { formatCurrency } from '@repo/util/string';

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

  const [selectedOptionMenuSeq, setSelectedOptionMenuSeq] = useState<
    number | null
  >(null);

  const onClickOptionDetail = (
    e: React.MouseEvent<HTMLDivElement>,
    menuSeq: number
  ) => {
    e.stopPropagation();
    setSelectedOptionMenuSeq(menuSeq);
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
                    amount: formatCurrency(menu.menuPrice),
                  })}
                </p>
                <div onClick={(e) => onClickOptionDetail(e, menu.menuSeq)}>
                  {t('옵션')}
                </div>
              </S.ButtonRightContainer>
            </button>
          </S.MenuItem>
        ))}
      </S.MenuList>

      {selectedOptionMenuSeq && (
        <OptionDetailModal
          menu={menus.find((menu) => menu.menuSeq === selectedOptionMenuSeq)}
          onClose={() => setSelectedOptionMenuSeq(null)}
        />
      )}
    </>
  );
};
