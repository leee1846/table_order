import * as S from '@/pages/MainPage/Contents/MenuItem/menuItem.style';
import { MenuDetailModal } from '@/pages/MainPage/Contents/MenuDetailModal';
import { MenuDetailWithOptionsModal } from '@/pages/MainPage/Contents/MenuDetailWithOptionsModal';
import type { ICategoryWithMenus, IMenu } from '@repo/api/types';
import { formatCurrency } from '@repo/util/string';
import { Thumbnail } from '@/feature/Thumbnail';
import { useCartStore } from '@/stores/useCartStore';
import { toast } from '@repo/feature/utils';
import { useCategoriesData } from '@/hooks/useCategoriesData';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { CURRENCY_SYMBOL } from '@/constants/common';
import { useCustomerLanguageStore } from '@/stores/useCustomerLanguageStore';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { useModalStore } from '@/stores/useModalStore';

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
  const { t } = useCustomerTranslation();
  const { data: languageData } = useCustomerLanguageStore();
  const { data: shopDetailData } = useShopDetailData();

  const currencySymbol =
    CURRENCY_SYMBOL[shopDetailData?.shopSetting?.currencySetting ?? 'KRW'];

  const firstImage = menu.menuImageList?.[0];

  const { data: modalData, openMenuDetail, closeMenuDetail } = useModalStore();

  const { addToCart, updateCartItemQuantity, data: cartData } = useCartStore();
  const { firstOrderRequiredCategories } = useCategoriesData();

  const onClickMenu = () => {
    // 품절되었을경우
    if (menu.isOutOfStock) {
      toast(t('메뉴가 품절되었습니다.'), {
        position: 'center-center',
        duration: 1000,
      });
      return;
    }

    // 첫 주문 필수 항목이 있는 경우
    if (cartData.hasFirstOrderRequiredItems) {
      const menusInCart = cartData.menus;
      const hasFirstOrderRequiredMenu = firstOrderRequiredCategories.some((c) =>
        menusInCart.some((m) => m.categorySeq === c.categorySeq)
      );

      // 카트에 첫 주문 필수 항목이 없고, 현재 선택한 메뉴도 첫 주문 필수 항목이 아닌 경우
      if (!hasFirstOrderRequiredMenu && !category.isFirstOrderRequired) {
        const categoryName = firstOrderRequiredCategories
          .map((c) => c.categoryName)
          .join(', ');
        toast(
          t('[{{categoryName}}]\n 메뉴 중 1개 이상 주문해주세요.', {
            categoryName,
          }),
          { position: 'center-center', duration: 3000 }
        );
        return;
      }
    }

    // 수량선택이 불가능한경우
    if (!category.isQuantitySelectable && menu.optionGroupList.length < 1) {
      // 주문하기 사용 === false 인 경우
      if (!shopDetailData?.shopSetting?.isMenuboardOrderable) {
        return;
      }

      // 같은 menuSeq와 같은 옵션 조합을 가진 아이템 찾기
      const cartMenuIndex = cartData.menus.findIndex(
        (item) =>
          item.menuSeq === menu.menuSeq && item.selectedOptions.length === 0
      );

      if (cartMenuIndex !== -1) {
        // 이전 데이터가 있으면 수량만 업데이트
        const prevCartMenuData = cartData.menus[cartMenuIndex];
        if (prevCartMenuData) {
          updateCartItemQuantity(cartMenuIndex, prevCartMenuData.quantity + 1);
        }
      } else {
        // 없으면 새로 추가
        addToCart({
          categorySeq: menu.categorySeq,
          menuSeq: menu.menuSeq,
          menuName: menu.menuName,
          menuPrice: menu.menuPrice,
          quantity: 1,
          selectedOptions: [],
        });
      }

      toast(t('메뉴가 담겼습니다.'), {
        position: 'center-center',
        duration: 1000,
      });
      return;
    }

    openMenuDetail(menu.menuSeq);
  };

  const menuName =
    menu.localeMenuName?.[languageData.currentLanguage] || menu.menuName;
  const menuDescription =
    menu.localeMenuDescription?.[languageData.currentLanguage] ||
    menu.menuDescription;
  const priceText = `${currencySymbol}${formatCurrency(menu.menuPrice)}`;
  const ariaLabel = menu.isOutOfStock
    ? `${t('품절된 메뉴')}: ${menuName}, ${priceText}`
    : `${t('메뉴 선택')}: ${menuName}, ${priceText}`;

  return (
    <>
      <S.Container
        layout={layout}
        type="button"
        onClick={onClickMenu}
        aria-label={ariaLabel}
        aria-disabled={menu.isOutOfStock}
      >
        <Thumbnail
          menu={menu}
          image={firstImage}
          width={IMAGE_SIZE[layout].width}
        />
        <S.Content>
          <S.MenuName>{menuName}</S.MenuName>
          <S.MenuPrice>
            <span>{priceText}</span>
          </S.MenuPrice>
          {layout === 1 && <S.Description>{menuDescription}</S.Description>}
        </S.Content>
      </S.Container>

      {modalData.openedMenuDetailSeq === menu.menuSeq &&
        menu.optionGroupList.length < 1 && (
          <MenuDetailModal onClose={closeMenuDetail} menu={menu} />
        )}

      {modalData.openedMenuDetailSeq === menu.menuSeq &&
        menu.optionGroupList.length > 0 && (
          <MenuDetailWithOptionsModal
            onClose={closeMenuDetail}
            menu={menu}
            category={category}
          />
        )}
    </>
  );
};
