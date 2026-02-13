import { createPortal } from 'react-dom';
import { useState } from 'react';
import * as S from '@/pages/MainPage/CartList/cartList.style';
import { BasicButton, NumberInput } from '@repo/ui/components';
import { DeleteIcon, EmptedCartIcon } from '@repo/ui/icons';
import { useThemeMode } from '@repo/ui';
import { openDualActionDialog, toast } from '@repo/feature/utils';
import { useCartStore } from '@/stores/useCartStore';
import { formatCurrency } from '@repo/util/string';
import { MenuDetailWithOptionsModal } from '../Contents/MenuDetailWithOptionsModal';
import type { ICategoryWithMenus } from '@repo/api/types';
import type { ICartMenu } from '@/types/cart';
import { calculateMenuTotalPrice } from '@/utils/calculation';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { useCategoriesData } from '@/hooks/useCategoriesData';
import { CURRENCY_SYMBOL, MENU_MAX_QUANTITY } from '@/constants/common';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { useModalStore } from '@/stores/useModalStore';

const TOAST_OPTIONS = {
  position: 'center-center' as const,
  duration: 2000,
};

interface Props {
  onClose: () => void;
  categories: ICategoryWithMenus[];
  executePostpaidOrder: () => Promise<{
    orderGroupUuid: string;
    result: boolean;
    totalPrice: number;
  }>;
  openPaymentsModal: () => void;
}

export const CartList = ({
  onClose,
  categories,
  executePostpaidOrder,
  openPaymentsModal,
}: Props) => {
  const { t } = useCustomerTranslation();
  const { theme } = useThemeMode();
  const { data: modalData, setModalData } = useModalStore();
  const { data: shopDetailData } = useShopDetailData();
  const { firstOrderRequiredCategories } = useCategoriesData();
  const {
    data: cartData,
    removeFromCart,
    updateCartItemQuantity,
    // clearCart,
  } = useCartStore();

  const [selectedMenu, setSelectedMenu] = useState<ICartMenu | null>(null);
  const [selectedMenuIndex, setSelectedMenuIndex] = useState<number | null>(
    null
  );

  const currencySymbol =
    CURRENCY_SYMBOL[shopDetailData?.shopSetting?.currencySetting ?? 'KRW'];

  const selectedMenuDetail = categories
    .find((category) => category.categorySeq === selectedMenu?.categorySeq)
    ?.menuInfoList.find((menu) => menu.menuSeq === selectedMenu?.menuSeq);

  // 카트 메뉴의 총 가격 계산
  const calculateCartMenuPrice = (cartMenu: ICartMenu): number => {
    const options = cartMenu.selectedOptions.map((option) => ({
      optionPrice: option.optionPrice,
      quantity: option.quantity,
    }));

    return calculateMenuTotalPrice(
      cartMenu.menuPrice,
      cartMenu.quantity,
      options
    );
  };

  // 전체 카트의 총 합계 계산
  const calculateTotalPrice = (): number => {
    return cartData.menus.reduce((total, menu) => {
      return total + calculateCartMenuPrice(menu);
    }, 0);
  };

  const handleRemoveMenu = (index: number) => {
    removeFromCart(index);
    toast(t('메뉴가 삭제되었습니다.'), TOAST_OPTIONS);
  };

  // 카트 메뉴 수량 변경 핸들러
  const handleCartQuantityChange = (index: number, newQuantity: number) => {
    if (newQuantity > MENU_MAX_QUANTITY) {
      toast(
        t('최대 {{maxQuantity}}개까지 선택 가능합니다.', {
          maxQuantity: MENU_MAX_QUANTITY,
        }),
        { position: 'center-center', duration: 1500 }
      );
      return;
    }

    updateCartItemQuantity(index, newQuantity);
  };

  const handleOpenMenuDetailModal = (menu: ICartMenu, index: number) => {
    setSelectedMenu(menu);
    setSelectedMenuIndex(index);
    setModalData('isCartMenuDetailModalOpened', true);
  };

  const handleCloseMenuDetailModal = () => {
    setModalData('isCartMenuDetailModalOpened', false);
    setSelectedMenuIndex(null);
  };

  const handleOrderSubmit = () => {
    if (cartData.menus.length < 1) {
      toast(t('현재 담긴 메뉴가 없어요.'), TOAST_OPTIONS);
      return;
    }

    const hasMenuWithZeroQuantity = cartData.menus.some(
      (menu) => menu.quantity < 1
    );
    if (hasMenuWithZeroQuantity) {
      toast(t('각 메뉴의 수량을 {{count}}개 이상 설정해주세요.', { count: 1 }), TOAST_OPTIONS);
      return;
    }

    // 첫 주문 필수 항목이 있는 경우
    if (cartData.hasFirstOrderRequiredItems) {
      const menusInCart = cartData.menus;
      const hasFirstOrderRequiredMenu = firstOrderRequiredCategories.some((c) =>
        menusInCart.some((m) => m.categorySeq === c.categorySeq)
      );

      // 카트에 첫 주문 필수 항목이 없는 경우
      if (!hasFirstOrderRequiredMenu) {
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

    // 최소 주문 수량 검증
    for (const cartMenu of cartData.menus) {
      const originalMenu = categories
        .find((category) => category.categorySeq === cartMenu.categorySeq)
        ?.menuInfoList.find((menu) => menu.menuSeq === cartMenu.menuSeq);

      if (
        originalMenu &&
        originalMenu.minQuantity &&
        originalMenu.minQuantity > 0 &&
        originalMenu.minQuantity > cartMenu.quantity
      ) {
        toast(
          t('{{menuName}}의 최소 주문 수량은 {{minQuantity}}개 입니다.', {
            menuName: cartMenu.menuName,
            minQuantity: originalMenu.minQuantity,
          }),
          { position: 'center-center', duration: 1500 }
        );
        return;
      }
    }

    const totalMenuAmount = calculateTotalPrice();
    const firstOrderMinAmount =
      shopDetailData?.shopSetting?.firstOrderMinAmount;

    if (
      firstOrderMinAmount &&
      firstOrderMinAmount > 0 &&
      totalMenuAmount < firstOrderMinAmount
    ) {
      toast(
        t('최소 주문 금액은 {{minAmount}}원 입니다.', {
          minAmount: formatCurrency(firstOrderMinAmount),
        }),
        TOAST_OPTIONS
      );
      return;
    }

    openDualActionDialog({
      title: t('메뉴를 주문할까요?'),
      content: t('주방 접수된 이후에는 취소가 불가능해요.'),
      primaryText: t('주문하기'),
      secondaryText: t('이전으로'),
      onConfirm: async () => {
        const totalPrice = calculateTotalPrice();

        // 총 금액이 0원이거나 선불이 아닌 경우 후불 처리
        if (totalPrice === 0 || !shopDetailData?.shopSetting?.usePrepayment) {
          const response = await executePostpaidOrder();
          if (response.result) {
            setModalData('isOrderCompleteModalOpened', true);
            onClose();
          }
          return;
        }

        // 선불 처리
        openPaymentsModal();
      },
    });
  };

  const hasMenusInCart = cartData.menus.length > 0;
  const isOrderSheetTotalVisible =
    shopDetailData?.shopSetting?.isOrderSheetTotalVisible;
  const isMenuDetailModalOpen =
    modalData.isCartMenuDetailModalOpened &&
    selectedMenuDetail &&
    selectedMenu &&
    selectedMenuIndex !== null;

  return createPortal(
    <S.Background onClick={onClose}>
      <S.Container
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        <S.Title id="cart-title">{t('장바구니')}</S.Title>

        <S.OrderList role="list" aria-label={t('장바구니')}>
          {!hasMenusInCart && (
            <S.NoContent>
              <EmptedCartIcon theme={theme} width={52} height={52} />
              <p>{t('현재 담긴 메뉴가 없어요.')}</p>
            </S.NoContent>
          )}

          {cartData.menus.map((menu, index) => {
            const hasOptions = menu.selectedOptions.length > 0;

            return (
              <S.OrderItem key={`order-${index + 1}`} role="listitem">
                <S.OrderMenu>
                  <h3>{menu.menuName}</h3>
                  <p>{formatCurrency(menu.menuPrice * menu.quantity)}</p>
                </S.OrderMenu>

                {hasOptions && (
                  <S.Options>
                    {menu.selectedOptions.map((option) => (
                      <S.OptionItem key={option.optionSeq}>
                        <p>
                          <span />
                          {option.optionName}
                        </p>
                        <div>
                          <p>
                            {formatCurrency(option.quantity * menu.quantity)}
                          </p>
                          <p>
                            {formatCurrency(
                              option.optionPrice *
                                option.quantity *
                                menu.quantity
                            )}
                          </p>
                        </div>
                      </S.OptionItem>
                    ))}
                    <S.OptionButtonContainer>
                      <button
                        type="button"
                        onClick={() => handleOpenMenuDetailModal(menu, index)}
                        aria-label={`${menu.menuName} ${t('옵션')}`}
                      >
                        {t('옵션')}
                      </button>
                    </S.OptionButtonContainer>
                  </S.Options>
                )}

                <S.ButtonContainer>
                  <S.DeleteButton
                    onClick={() => handleRemoveMenu(index)}
                    aria-label={`${menu.menuName} ${t('메뉴 삭제')}`}
                  >
                    <DeleteIcon color={theme.mode.grey[600]} />
                  </S.DeleteButton>
                  <NumberInput
                    variant="square"
                    size="L"
                    min={0}
                    value={menu.quantity}
                    onChange={(value) => handleCartQuantityChange(index, value)}
                  />
                </S.ButtonContainer>
              </S.OrderItem>
            );
          })}
        </S.OrderList>

        <S.TotalContainer>
          {isOrderSheetTotalVisible && (
            <S.TotalInfo role="status" aria-live="polite">
              <h3>{t('합계')}</h3>
              <p>
                {currencySymbol}
                {formatCurrency(calculateTotalPrice())}
              </p>
            </S.TotalInfo>
          )}
          <BasicButton
            variant="Solid_Blue_2XL"
            onClick={handleOrderSubmit}
            aria-label={t('주문하기')}
          >
            {t('주문하기')}
          </BasicButton>
        </S.TotalContainer>
      </S.Container>

      {isMenuDetailModalOpen && (
        <MenuDetailWithOptionsModal
          onClose={handleCloseMenuDetailModal}
          menu={selectedMenuDetail}
          initialQuantity={selectedMenu.quantity}
          initialSelectedOptions={selectedMenu.selectedOptions}
          cartItemIndex={selectedMenuIndex}
        />
      )}
    </S.Background>,
    document.body
  );
};
