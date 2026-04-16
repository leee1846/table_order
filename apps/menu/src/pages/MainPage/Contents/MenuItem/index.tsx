import * as S from '@/pages/MainPage/Contents/MenuItem/menuItem.style';
import { MenuDetailModal } from '@/pages/MainPage/Contents/MenuDetailModal';
import { MenuDetailWithOptionsModal } from '@/pages/MainPage/Contents/MenuDetailWithOptionsModal';
import type { ICategoryWithMenus, IMenu } from '@repo/api/types';
import { formatCurrency } from '@repo/util/string';
import { Thumbnail } from '@/feature/Thumbnail';
import { useCartStore } from '@/stores/useCartStore';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { toast } from '@repo/feature/utils';
import { useShopDetailStore } from '@/stores/useShopDetailStore';
import { useCustomerLanguageStore } from '@/stores/useCustomerLanguageStore';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { useModalStore } from '@/stores/useModalStore';
import { hasTableOrderHistory } from '@/utils/validateCartOrder';

const IMAGE_SIZE = {
  1: {
    width: '21rem',
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
  const currentLanguage = useCustomerLanguageStore(
    (s) => s.data.currentLanguage
  );

  const firstImage = menu.menuImageList?.filter(
    (image) => image.imageIndex === 0
  )[0];

  // 이 메뉴의 모달 열림 여부만 구독
  const isMenuDetailOpen = useModalStore(
    (s) => s.data.openedMenuDetailSeq === menu.menuSeq
  );

  // 액션만 구독
  const addToCart = useCartStore((s) => s.addToCart);
  const updateCartItemQuantity = useCartStore((s) => s.updateCartItemQuantity);

  const onClickMenu = () => {
    const cartData = useCartStore.getState().data;
    const firstOrderRequiredCategories = useCategoryStore
      .getState()
      .data.visibleCategories.filter((c) => c.isFirstOrderRequired);

    // 품절되었을경우
    if (menu.isOutOfStock) {
      toast(t('메뉴가 품절되었습니다.'), {
        position: 'center-center',
        duration: 1000,
      });
      return;
    }

    // 첫 주문 필수 항목이 있고, 테이블에 기존 주문 라인이 없을 때만 검사 (이미 주문한 적 있으면 생략)
    if (cartData.hasFirstOrderRequiredItems && !hasTableOrderHistory()) {
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
      if (
        !useShopDetailStore.getState().data?.shopSetting?.isMenuboardOrderable
      ) {
        toast(t('주문하기 기능이 비활성화 되었습니다.'), {
          position: 'center-center',
          duration: 1500,
        });
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
          localeMenuName: menu.localeMenuName,
        });
      }

      toast(t('메뉴가 담겼습니다.'), {
        position: 'center-center',
        duration: 1000,
      });
      return;
    }

    useModalStore.getState().openMenuDetail(menu.menuSeq);
  };

  const menuName = menu.localeMenuName?.[currentLanguage] || menu.menuName;
  const menuDescription = menu.localeMenuDescription?.[currentLanguage] || '';
  const priceText = `₩${formatCurrency(menu.menuPrice)}`;
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
          width={layout === 1 ? IMAGE_SIZE[layout].width : '100%'}
        />
        <S.Content>
          <S.MenuName>{menuName}</S.MenuName>
          <S.MenuPrice>
            <span>{priceText}</span>
          </S.MenuPrice>
          {layout === 1 && <S.Description>{menuDescription}</S.Description>}
        </S.Content>
      </S.Container>

      {isMenuDetailOpen && menu.optionGroupList.length < 1 && (
        <MenuDetailModal
          onClose={() => useModalStore.getState().closeMenuDetail()}
          menu={menu}
        />
      )}

      {isMenuDetailOpen && menu.optionGroupList.length > 0 && (
        <MenuDetailWithOptionsModal
          onClose={() => useModalStore.getState().closeMenuDetail()}
          menu={menu}
          category={category}
        />
      )}
    </>
  );
};
