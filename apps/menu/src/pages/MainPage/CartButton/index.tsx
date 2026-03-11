import { useState } from 'react';
import type { ICategoryWithMenus, IOrder } from '@repo/api/types';
import { usePostTableOrder } from '@repo/api/queries';
import type { ICartMenu } from '@/types/cart';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { useCartStore } from '@/stores/useCartStore';
import { useCustomerCountStore } from '@/stores/useCustomerCountStore';
import { useModalStore } from '@/stores/useModalStore';
import { calculateMenuTotalPrice } from '@/utils/calculation';
import { CartList } from '@/pages/MainPage/CartList';
import { OrderCompleteModal } from '@/pages/MainPage/OrderCompleteModal';
import { PaymentsModal } from '@/pages/MainPage/PaymentsModal';
import { SplitPaymentModal } from '@/pages/MainPage/SplitPaymentModal';
import * as S from '@/pages/MainPage/CartButton/cartButton.style';
import { ROUTES } from '@/constants/routes';
import { useNavigate } from 'react-router-dom';
import { useShopStore } from '@/stores/useShopStore';
import { useShopDetailStore } from '@/stores/useShopDetailStore';
import { useDeviceStore } from '@/stores/useDeviceStore';

interface Props {
  categories: ICategoryWithMenus[];
}

export const CartButton = ({ categories }: Props) => {
  const navigate = useNavigate();
  const { t } = useCustomerTranslation();
  const { data: cartData, clearCart } = useCartStore();
  const { data: modalData, setModalData } = useModalStore();
  const { mutateAsync: createTableOrder } = usePostTableOrder({
    ignoreGlobalErrors: [400],
  });
  const { data: shopData } = useShopStore();
  const { data: customerCountData } = useCustomerCountStore();

  /** 결제 방법 선택 모달 */
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    'card' | 'cash' | 'split' | 'payAfter' | null
  >(null);

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

  const calculateTotalPrice = (): number => {
    return cartData.menus.reduce((total, menu) => {
      return total + calculateCartMenuPrice(menu);
    }, 0);
  };

  const convertCartDataToOrders = (): IOrder[] => {
    return cartData.menus.map((menu) => ({
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
  };

  const adjustOptionQuantitiesForOrder = (orders: IOrder[]): IOrder[] => {
    return orders.map((order) => ({
      ...order,
      selectedOptions: order.selectedOptions.map((option) => ({
        ...option,
        quantity: order.quantity * option.quantity,
      })),
    }));
  };

  /**
   * 주문 실행 로직 (onConfirm 내부 로직만 추출)
   */
  const executePostpaidOrder = async (): Promise<{
    orderGroupUuid: string;
    result: boolean;
    totalPrice: number;
  }> => {
    try {
      const orders = convertCartDataToOrders();
      const totalPrice = calculateTotalPrice();

      const response = await createTableOrder({
        shopCode: shopData?.shopCode ?? '',
        tableNumber: useDeviceStore.getState().data?.tableNumber ?? '',
        orderType: 'MENU',
        // 객수 미사용시 1명으로 처리
        customerCount: customerCountData?.adultCount ?? 1,
        // 객수 미사용시 0명으로 처리
        kidsCustomerCount: customerCountData?.childCount ?? 0,
        totalAmount: totalPrice.toString(),
        orders: adjustOptionQuantitiesForOrder(orders),
      }).catch((error) => {
        if (error.response?.status === 400) {
          // 삭제된 테이블일경우
          navigate(ROUTES.TABLES.generate());
        }
      });

      setModalData('orderCompleteData', orders);
      setModalData('orderCompleteTotalPrice', totalPrice);
      clearCart();
      setModalData('isCartListOpened', false);

      return {
        result: true,
        orderGroupUuid: response?.data?.orderGroupUuid ?? '',
        totalPrice,
      };
    } catch (_error) {
      return {
        result: false,
        orderGroupUuid: '',
        totalPrice: 0,
      };
    }
  };

  const handleCartButtonClick = () => {
    if (
      !useShopDetailStore.getState().data?.shopSetting?.isMenuboardOrderable
    ) {
      return;
    }
    setModalData('isCartListOpened', true);
  };

  const handleCartListClose = () => {
    setModalData('isCartListOpened', false);
  };

  const handlePaymentsModalOpen = () => {
    setModalData('isPaymentsModalOpened', true);
  };

  const handlePaymentsModalClose = () => {
    setModalData('isPaymentsModalOpened', false);
    setSelectedPaymentMethod(null);
  };

  const handlePaymentMethodConfirm = () => {
    if (selectedPaymentMethod === 'split') {
      setModalData('isSplitPaymentModalOpened', true);
    }
    if (selectedPaymentMethod === 'card') {
      setModalData('isCardPaymentInstallmentModalOpened', true);
    }
  };

  const handleSplitPaymentModalClose = () => {
    setModalData('isSplitPaymentModalOpened', false);
  };

  const handleOrderCompleteModalClose = () => {
    setModalData('isOrderCompleteModalOpened', false);
    setModalData('orderCompleteData', null);
    setModalData('orderCompleteTotalPrice', 0);
  };

  const getTotalCartItemCount = (): number => {
    return cartData.menus.reduce((acc, curr) => acc + curr.quantity, 0);
  };

  return (
    <>
      <S.Container
        type="button"
        onClick={handleCartButtonClick}
        aria-label={`${t('장바구니 열기')}, ${t('{{count}}개 담김', { count: getTotalCartItemCount() })}`}
      >
        <p>{t('장바구니')}</p>
        <p>{getTotalCartItemCount()}</p>
      </S.Container>

      {/* 장바구니 모달 */}
      {modalData.isCartListOpened && (
        <CartList
          onClose={handleCartListClose}
          executePostpaidOrder={executePostpaidOrder}
          categories={categories}
          openPaymentsModal={handlePaymentsModalOpen}
        />
      )}

      {/* 결제 방법 선택 모달 */}
      {modalData.isPaymentsModalOpened && (
        <PaymentsModal
          onClose={handlePaymentsModalClose}
          selectedPaymentMethod={selectedPaymentMethod}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
          openNextModal={handlePaymentMethodConfirm}
          executePostpaidOrder={executePostpaidOrder}
        />
      )}

      {/* 분할 결제 모달 */}
      {modalData.isSplitPaymentModalOpened && (
        <SplitPaymentModal onClose={handleSplitPaymentModalClose} />
      )}

      {/* 주문 완료 모달 */}
      {modalData.isOrderCompleteModalOpened && (
        <OrderCompleteModal
          onClose={handleOrderCompleteModalClose}
          orderData={modalData.orderCompleteData ?? []}
          totalPrice={modalData.orderCompleteTotalPrice}
        />
      )}
    </>
  );
};
