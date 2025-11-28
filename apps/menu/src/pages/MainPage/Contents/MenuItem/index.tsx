import { useState } from 'react';
import * as S from '@/pages/MainPage/Contents/MenuItem/menuItem.style';
import { MenuDetailModal } from '@/pages/MainPage/Contents/MenuDetailModal';
import { MenuDetailWithOptionsModal } from '@/pages/MainPage/Contents/MenuDetailWithOptionsModal';
import type { ICategoryWithMenus, IMenu } from '@repo/api/types';
import { formatCurrency } from '@repo/util/string';
import { Thumbnail } from '@/feature/Thumbnail';
import { useCartStore } from '@/stores/useCartStore';
import { toast } from '@repo/feature/utils';
import { useCategoryStore } from '@/stores/useCategoryStore';

const IMAGE_SIZE = {
  1: {
    width: '20.9375rem',
  },
  2: {
    width: '22.5rem',
  },
  3: {
    width: '17.25rem',
  },
};

interface Props {
  layout: 1 | 2 | 3;
  category: ICategoryWithMenus;
  menu: IMenu;
}
export const MenuItem = ({ layout, category, menu }: Props) => {
  const firstImage = menu.menuImageList?.[0];

  const [isMenuDetailOpen, setIsMenuDetailOpen] = useState(false);

  const { addToCart, data: cartData } = useCartStore();
  const { getVisibleCategories } = useCategoryStore();

  const onClickMenu = () => {
    // 품절되었을경우우
    if (menu.isOutOfStock) {
      toast('메뉴가 품절되었습니다.');
      return;
    }

    // 첫 주문 필수 항목이 있는 경우
    if (cartData.hasFirstOrderRequiredItems) {
      const firstOrderRequiredCategories = getVisibleCategories().filter(
        (c) => c.isFirstOrderRequired
      );
      const menusInCart = cartData.menus;
      const hasFirstOrderRequiredMenu = firstOrderRequiredCategories.some((c) =>
        menusInCart.some((m) => m.categorySeq === c.categorySeq)
      );

      // 카트에 첫 주문 필수 항목이 없는 경우
      if (!hasFirstOrderRequiredMenu) {
        toast(
          `[${firstOrderRequiredCategories.map((c) => c.categoryName).join(', ')}]\n 메뉴 중 1개 이상 주문해주세요.`,
          {
            position: 'top-center',
            duration: 3000,
          }
        );
        return;
      }
    }

    // 수량선택이 불가능한경우
    if (!category.isQuantitySelectable) {
      toast('메뉴가 담겼습니다.');
      addToCart(menu);
      return;
    }

    setIsMenuDetailOpen(true);
  };

  return (
    <>
      <S.Container layout={layout} type="button" onClick={onClickMenu}>
        <Thumbnail
          menu={menu}
          image={firstImage}
          width={IMAGE_SIZE[layout].width}
        />
        <S.Content>
          <S.MenuName>{menu.menuName}</S.MenuName>
          <S.MenuPrice>
            {/* TODO 통화설정 추후 적용 */}
            <span>{formatCurrency(menu.menuPrice)}</span>
          </S.MenuPrice>
          {layout === 1 && (
            <S.Description>{menu.menuDescription}</S.Description>
          )}
        </S.Content>
      </S.Container>

      {isMenuDetailOpen && menu.optionGroupList.length < 1 && (
        <MenuDetailModal
          onClose={() => setIsMenuDetailOpen(false)}
          menu={menu}
        />
      )}

      {isMenuDetailOpen && menu.optionGroupList.length > 0 && (
        <MenuDetailWithOptionsModal
          onClose={() => setIsMenuDetailOpen(false)}
        />
      )}
    </>
  );
};
