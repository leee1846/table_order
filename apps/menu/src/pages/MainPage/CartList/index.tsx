import { createPortal } from 'react-dom';
import { useState, useMemo } from 'react';
import * as S from '@/pages/MainPage/CartList/cartList.style';
import { BasicButton, NumberInput } from '@repo/ui/components';
import { DeleteIcon, EmptedCartIcon } from '@repo/ui/icons';
import { useThemeMode } from '@repo/ui';
import {
  openDualActionDialog,
  openConfirmDialog,
  toast,
} from '@repo/feature/utils';
import { useCartStore } from '@/stores/useCartStore';
import { formatCurrency } from '@repo/util/string';
import { MenuDetailWithOptionsModal } from '../Contents/MenuDetailWithOptionsModal';
import type {
  ICategoryWithMenus,
  ICancelOrderMenuRequest,
  IOrder,
} from '@repo/api/types';
import type { ICartMenu } from '@/types/cart';
import {
  buildMenuSeqToCategoryMenuMap,
  calculateMenuTotalPrice,
  isOptionGroupIndependentInCategoryMenu,
} from '@/utils/calculation';
import { useShopDetailStore } from '@/stores/useShopDetailStore';
import { useShopStore } from '@/stores/useShopStore';
import { MENU_MAX_QUANTITY } from '@/constants/common';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { useModalStore } from '@/stores/useModalStore';
import { useCustomerLanguageStore } from '@/stores/useCustomerLanguageStore';
import { usePosOrderStore } from '@repo/feature/stores';
// import { usePutCancelOrderMenu } from '@repo/api/queries';
import { useTableOrderHistoriesData } from '@/hooks/useTableOrderHistoriesData';
import { localizeOrders } from '@/utils/localizeOrders';
import { useIdleTimeout } from '@/hooks/useIdleTimeout';
import { IdleTimerMessage } from '@/feature/IdleTimerMessage';
import { validateCartOrder } from '@/utils/validateCartOrder';

const TOAST_OPTIONS = {
  position: 'center-center' as const,
  duration: 2000,
};

interface Props {
  onClose: () => void;
  categories: ICategoryWithMenus[];
  executePostpaidOrder: () => Promise<{
    orderGroupUuid: string;
    orderUuid: string;
    result: boolean;
    totalPrice: number;
    orders: IOrder[];
    cancelOrderMenuRequest: ICancelOrderMenuRequest;
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
  const currentLanguage = useCustomerLanguageStore(
    (s) => s.data.currentLanguage
  );
  const { theme } = useThemeMode();
  const { data: modalData, setModalData } = useModalStore();
  const shopDetailData = useShopDetailStore((s) => s.data);
  // const { mutateAsync: cancelOrderMenu } = usePutCancelOrderMenu();
  const { refresh: refreshTableOrderHistoriesData } =
    useTableOrderHistoriesData({ skipInitialRequest: true });

  const {
    data: cartData,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
  } = useCartStore();

  const { startTimer, clearTimer, remainingSeconds } = useIdleTimeout(onClose);

  const [selectedMenu, setSelectedMenu] = useState<ICartMenu | null>(null);
  const [selectedMenuIndex, setSelectedMenuIndex] = useState<number | null>(
    null
  );

  const selectedMenuDetail = categories
    .find((category) => category.categorySeq === selectedMenu?.categorySeq)
    ?.menuInfoList.find((menu) => menu.menuSeq === selectedMenu?.menuSeq);

  // menuSeq → 카테고리 메뉴 맵 (isMenuQuantityIndependent 조회용, categories 변경 시에만 재빌드)
  const menuSeqToCategoryMenuMap = useMemo(
    () => buildMenuSeqToCategoryMenuMap(categories),
    [categories]
  );

  // 카트 메뉴의 총 가격 계산
  const calculateCartMenuPrice = (cartMenu: ICartMenu): number => {
    const categoryMenu = menuSeqToCategoryMenuMap.get(cartMenu.menuSeq);
    const options = cartMenu.selectedOptions.map((option) => ({
      optionPrice: option.optionPrice,
      quantity: option.quantity,
      isMenuQuantityIndependent: isOptionGroupIndependentInCategoryMenu(
        categoryMenu,
        option.optionGroupSeq
      ),
    }));
    return calculateMenuTotalPrice(cartMenu.menuPrice, cartMenu.quantity, options);
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

    clearTimer();

    openDualActionDialog({
      title: t('메뉴를 주문할까요?'),
      content: t('주방 접수된 이후에는 취소가 불가능해요.'),
      primaryText: t('주문하기'),
      secondaryText: t('이전으로'),
      onCancel: () => {
        startTimer();
      },
      onConfirm: async () => {
        if (!validateCartOrder()) {
          startTimer();
          return;
        }

        const cartSnapshot = useCartStore.getState().data;
        const orderedMenus = cartSnapshot.menus;
        const totalPrice = orderedMenus.reduce(
          (total, menu) => total + calculateCartMenuPrice(menu),
          0
        );
        const shopSnapshot = useShopDetailStore.getState().data;

        // 총 금액이 0원이거나 선불이 아닌 경우 후불 처리
        if (totalPrice === 0 || !shopSnapshot?.shopSetting?.usePrepayment) {
          const response = await executePostpaidOrder();

          if (!response.result) {
            openConfirmDialog({
              title: t('오류'),
              content: t('주문에 실패했습니다. 다시 시도해주세요.'),
              confirmText: t('확인'),
            });
            return;
          }

          const handleOrderCompleteSuccess = async () => {
            const language =
              useCustomerLanguageStore.getState().data.currentLanguage;
            setModalData(
              'orderCompleteData',
              localizeOrders(response.orders, orderedMenus, language)
            );
            setModalData('orderCompleteTotalPrice', response.totalPrice);
            clearCart();
            // 모달이 열리는 시점의 언어를 고정 — OrderCompleteModal에서 이 값으로 번역 표시
            setModalData('orderCompleteLanguage', language);
            setModalData('isOrderCompleteModalOpened', true);
            onClose();
            await refreshTableOrderHistoriesData();
          };

          const isPosLinked =
            !!shopSnapshot?.shopSetting?.shopPosCode &&
            shopSnapshot?.shopSetting?.shopPosCode !== 'NONE';

          if (isPosLinked && response.orderUuid) {
            const handlePosOrderFailure = async () => {
              // try {
              //   if (response.cancelOrderMenuRequest.length > 0) {
              //     await cancelOrderMenu(response.cancelOrderMenuRequest);
              //   }
              // } catch {
              //   // 주문 취소 실패 시 무시
              // }
              openConfirmDialog({
                title: t('POS 오류'),
                content: t(
                  '주문 요청에 실패하였습니다. 직원에게 문의해주세요.'
                ),
                confirmText: t('확인'),
              });
              onClose();
            };

            const shopCode = String(
              useShopStore.getState().data?.shopCode ?? ''
            );
            usePosOrderStore
              .getState()
              .register(
                response.orderUuid,
                shopCode,
                handleOrderCompleteSuccess,
                handlePosOrderFailure
              );

            return;
          }

          handleOrderCompleteSuccess();
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
        <S.Title id="cart-title">
          <S.TitleWrapper>
            <span>{t('장바구니')}</span>
            <IdleTimerMessage remainingSeconds={remainingSeconds} />
          </S.TitleWrapper>
        </S.Title>
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
                  <h3>
                    {menu.localeMenuName?.[currentLanguage] ?? menu.menuName}
                  </h3>
                  <p>₩{formatCurrency(menu.menuPrice * menu.quantity)}</p>
                </S.OrderMenu>

                {hasOptions && (
                  <S.Options>
                    {menu.selectedOptions.map((option) => {
                      const categoryMenu = menuSeqToCategoryMenuMap.get(
                        menu.menuSeq
                      );
                      const isIndependent = isOptionGroupIndependentInCategoryMenu(
                        categoryMenu,
                        option.optionGroupSeq
                      );
                      const displayQty = isIndependent
                        ? option.quantity
                        : option.quantity * menu.quantity;
                      const displayPrice = option.optionPrice * displayQty;
                      return (
                      <S.OptionItem key={option.optionSeq}>
                        <p>
                          <span />
                          {option.localeOptionName?.[currentLanguage] ??
                            option.optionName}
                        </p>
                        <div>
                          <p>{formatCurrency(displayQty)}</p>
                          <p>₩{formatCurrency(displayPrice)}</p>
                        </div>
                      </S.OptionItem>
                      );
                    })}
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
                    min={1}
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
              <p>₩{formatCurrency(calculateTotalPrice())}</p>
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
