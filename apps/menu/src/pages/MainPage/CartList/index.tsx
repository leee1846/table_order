import { createPortal } from 'react-dom';
import * as S from '@/pages/MainPage/CartList/cartList.style';
import { BasicButton, NumberInput } from '@repo/ui/components';
import { DeleteIcon, EmptedCartIcon } from '@repo/ui/icons';
import { useThemeMode } from '@repo/ui';
import { openDualActionDialog, toast } from '@repo/feature/utils';
import { useCartStore } from '@/stores/useCartStore';
import { formatCurrency } from '@repo/util/string';
import { useState } from 'react';
import { MenuDetailWithOptionsModal } from '../Contents/MenuDetailWithOptionsModal';
import type { ICategoryWithMenus } from '@repo/api/types';
import type { ICartMenu } from '@/types/cart';
import { calculateMenuTotalPrice } from '@/utils/calculation';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { CURRENCY_SYMBOL } from '@/constants/common';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { useModalStore } from '@/stores/useModalStore';

interface Props {
  onClose: () => void;
  categories: ICategoryWithMenus[];
  executePostpaidOrder: () => Promise<boolean>;
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
  const currencySymbol =
    CURRENCY_SYMBOL[shopDetailData?.shopSetting?.currencySetting ?? 'KRW'];

  const [selectedMenu, setSelectedMenu] = useState<ICartMenu | null>(null);
  const [selectedMenuIndex, setSelectedMenuIndex] = useState<number | null>(
    null
  );
  const selectedMenuData = categories
    .find((category) => category.categorySeq === selectedMenu?.categorySeq)
    ?.menuInfoList.find((menu) => menu.menuSeq === selectedMenu?.menuSeq);

  const {
    data: cartData,
    removeFromCart,
    updateCartItemQuantity,
    // clearCart,
  } = useCartStore();

  const removeMenu = (index: number) => {
    removeFromCart(index);
    toast(t('메뉴가 삭제되었습니다.'), {
      position: 'center-center',
      duration: 2000,
    });
  };

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

  const order = () => {
    if (cartData.menus.length < 1) {
      toast(t('현재 담긴 메뉴가 없어요.'), {
        position: 'center-center',
        duration: 2000,
      });
      return;
    }

    const totalMenuQuantity = cartData.menus.reduce((total, menu) => {
      return total + menu.quantity;
    }, 0);

    if (
      shopDetailData?.shopSetting?.firstOrderMinAmount &&
      shopDetailData?.shopSetting?.firstOrderMinAmount > 0 &&
      totalMenuQuantity < shopDetailData?.shopSetting?.firstOrderMinAmount
    ) {
      toast(
        t('최소 주문 수량은 {{minQuantity}}개 입니다.', {
          minQuantity: shopDetailData?.shopSetting?.firstOrderMinAmount,
        }),
        {
          position: 'center-center',
          duration: 2000,
        }
      );
      return;
    }

    openDualActionDialog({
      title: t('메뉴를 주문할까요?'),
      content: t('주방 접수된 이후에는 취소가 불가능해요.'),
      primaryText: t('주문하기'),
      secondaryText: t('이전으로'),
      onConfirm: async () => {
        // 선불
        if (shopDetailData?.shopSetting?.usePrepayment) {
          openPaymentsModal();
          return;
        }

        // 후불
        const result = await executePostpaidOrder();
        if (result) {
          onClose();
        }
      },
    });
  };

  const onClickOptionButton = (menu: ICartMenu, index: number) => {
    setSelectedMenu(menu);
    setSelectedMenuIndex(index);
    setModalData('isCartMenuDetailModalOpened', true);
  };

  return createPortal(
    <S.Background onClick={onClose}>
      <S.Container onClick={(e) => e.stopPropagation()}>
        <S.Title>{t('장바구니')}</S.Title>

        <S.OrderList>
          {cartData.menus.length < 1 && (
            <S.NoContent>
              <EmptedCartIcon theme={theme} width={52} height={52} />
              <p>{t('현재 담긴 메뉴가 없어요.')}</p>
            </S.NoContent>
          )}

          {cartData.menus.map((menu, index) => (
            <S.OrderItem key={`order-${index + 1}`}>
              <S.OrderMenu>
                <p>{menu.menuName}</p>
                <p>{formatCurrency(menu.menuPrice)}</p>
              </S.OrderMenu>
              {menu.selectedOptions.length > 0 && (
                <S.Options>
                  {menu.selectedOptions.map((option) => (
                    <S.OptionItem key={option.optionSeq}>
                      <p>
                        <span />
                        {option.optionName}
                      </p>
                      <div>
                        <p>{formatCurrency(option.quantity)}</p>
                        <p>{formatCurrency(option.optionPrice)}</p>
                      </div>
                    </S.OptionItem>
                  ))}
                  {menu.selectedOptions.length > 0 && (
                    <S.OptionButtonContainer>
                      <button
                        type="button"
                        onClick={() => onClickOptionButton(menu, index)}
                      >
                        {t('옵션')}
                      </button>
                    </S.OptionButtonContainer>
                  )}
                </S.Options>
              )}

              <S.ButtonContainer>
                <S.DeleteButton onClick={() => removeMenu(index)}>
                  <DeleteIcon color={theme.mode.grey[600]} />
                </S.DeleteButton>
                <NumberInput
                  variant="square"
                  size="L"
                  min={1}
                  value={menu.quantity}
                  onChange={(value) => updateCartItemQuantity(index, value)}
                />
              </S.ButtonContainer>
            </S.OrderItem>
          ))}
        </S.OrderList>

        <S.TotalContainer>
          {shopDetailData?.shopSetting?.isOrderSheetTotalVisible && (
            <S.TotalInfo>
              <p>{t('합계')}</p>
              <p>
                {currencySymbol}
                {formatCurrency(calculateTotalPrice())}
              </p>
            </S.TotalInfo>
          )}
          <BasicButton variant="Solid_Blue_2XL" onClick={order}>
            {t('주문하기')}
          </BasicButton>
        </S.TotalContainer>
      </S.Container>

      {modalData.isCartMenuDetailModalOpened &&
        selectedMenuData &&
        selectedMenu &&
        selectedMenuIndex !== null && (
          <MenuDetailWithOptionsModal
            onClose={() => {
              setModalData('isCartMenuDetailModalOpened', false);
              setSelectedMenuIndex(null);
            }}
            menu={selectedMenuData}
            initialQuantity={selectedMenu.quantity}
            initialSelectedOptions={selectedMenu.selectedOptions}
            cartItemIndex={selectedMenuIndex}
          />
        )}
    </S.Background>,
    document.body
  );
};
