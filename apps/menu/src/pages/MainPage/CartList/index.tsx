import { createPortal } from 'react-dom';
import * as S from '@/pages/MainPage/CartList/cartList.style';
import { BasicButton, NumberInput } from '@repo/ui/components';
import { useTranslation } from 'react-i18next';
import { DeleteIcon, EmptedCartIcon } from '@repo/ui/icons';
import { useThemeMode } from '@repo/ui';
import { openDualActionDialog, toast } from '@repo/feature/utils';
import { useCartStore } from '@/stores/useCartStore';
import { formatCurrency } from '@repo/util/string';
import { useState } from 'react';
import { MenuDetailWithOptionsModal } from '../Contents/MenuDetailWithOptionsModal';
import type { ICategoryWithMenus, IOrder } from '@repo/api/types';
import type { ICartMenu } from '@/types/cart';
import { usePostTableOrder } from '@repo/api/queries';
import { useShopData } from '@/hooks/useShopData';
import { calculateMenuTotalPrice } from '@/utils/calculation';
import { useTableOrderHistoriesData } from '@/hooks/useTableOrderHistoriesData';

// TODO: 추후 주문 방법 선택 기능 추가 예정
const isPayAfter = true;
// TODO: 추후 테이블 번호 선택 기능 추가 예정
const tableNumber = 1;

interface Props {
  onClose: () => void;
  openPaymentsModal: () => void;
  openOrderCompleteModal: (orders: IOrder[], totalPrice: number) => void;
  categories: ICategoryWithMenus[];
}
export const CartList = ({
  onClose,
  openPaymentsModal,
  openOrderCompleteModal,
  categories,
}: Props) => {
  const { t } = useTranslation();
  const { theme } = useThemeMode();

  const [isMenuDetailModalOpen, setIsMenuDetailModalOpen] = useState(false);
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
    clearCart,
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
    return calculateMenuTotalPrice(
      cartMenu.menuPrice,
      cartMenu.quantity,
      cartMenu.selectedOptions
    );
  };

  // 전체 카트의 총 합계 계산
  const calculateTotalPrice = (): number => {
    return cartData.menus.reduce((total, menu) => {
      return total + calculateCartMenuPrice(menu);
    }, 0);
  };

  const { shopData } = useShopData();
  const { refresh: refreshTableOrderHistories } = useTableOrderHistoriesData({
    shopData,
    tableNumber,
  });
  const { mutateAsync: createTableOrder } = usePostTableOrder();
  const order = () => {
    if (cartData.menus.length < 1) {
      toast(t('현재 담긴 메뉴가 없어요.'), {
        position: 'center-center',
        duration: 2000,
      });
      return;
    }

    openDualActionDialog({
      title: t('메뉴를 주문할까요?'),
      content: t('주방 접수된 이후에는 취소가 불가능해요.'),
      primaryText: t('주문하기'),
      secondaryText: t('이전으로'),
      onConfirm: async () => {
        const orders = cartData.menus.map((menu) => ({
          menuSeq: menu.menuSeq,
          menuName: menu.menuName,
          menuPrice: menu.menuPrice,
          quantity: menu.quantity,
          selectedOptions: menu.selectedOptions.map((selectedOption) => ({
            optionSeq: selectedOption.optionSeq,
            optionGroupSeq: selectedOption.optionGroupSeq,
            optionName: selectedOption.optionName,
            optionPrice: selectedOption.optionPrice,
            quantity: selectedOption.quantity,
          })),
        }));

        if (isPayAfter) {
          await createTableOrder({
            shopCode: shopData?.shopCode ?? '',
            tableNumber,
            orderType: 'MENU',
            orders,
          });

          await refreshTableOrderHistories();
          const totalPrice = calculateTotalPrice();
          openOrderCompleteModal(orders, totalPrice);
          clearCart();
          onClose();
          return;
        }
        openPaymentsModal();
      },
    });
  };

  const onClickOptionButton = (menu: ICartMenu, index: number) => {
    setSelectedMenu(menu);
    setSelectedMenuIndex(index);
    setIsMenuDetailModalOpen(true);
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
          <S.TotalInfo>
            <p>{t('합계')}</p>
            <p>{formatCurrency(calculateTotalPrice())}</p>
          </S.TotalInfo>
          <BasicButton variant="Solid_Blue_2XL" onClick={order}>
            {t('주문하기')}
          </BasicButton>
        </S.TotalContainer>
      </S.Container>

      {isMenuDetailModalOpen &&
        selectedMenuData &&
        selectedMenu &&
        selectedMenuIndex !== null && (
          <MenuDetailWithOptionsModal
            onClose={() => {
              setIsMenuDetailModalOpen(false);
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
