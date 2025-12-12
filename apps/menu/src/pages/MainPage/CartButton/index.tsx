import * as S from '@/pages/MainPage/CartButton/cartButton.style';
import { useState } from 'react';
import { CartList } from '@/pages/MainPage/CartList';
import { OrderCompleteModal } from '@/pages/MainPage/OrderCompleteModal';
import { PaymentsModal } from '@/pages/MainPage/PaymentsModal';
import { SplitPaymentModal } from '@/pages/MainPage/SplitPaymentModal';
import { useCartStore } from '@/stores/useCartStore';
import type { ICategoryWithMenus, IOrder } from '@repo/api/types';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { useShopData } from '@/hooks/useShopData';
import { useCustomerCountStore } from '@/stores/useCustomerCountStore';
import { useTableOrderHistoriesData } from '@/hooks/useTableOrderHistoriesData';
import { useDeviceData } from '@/hooks/useDeviceData';
import { usePostTableOrder } from '@repo/api/queries';
import { calculateMenuTotalPrice } from '@/utils/calculation';
import type { ICartMenu } from '@/types/cart';

interface Props {
  categories: ICategoryWithMenus[];
}

export const CartButton = ({ categories }: Props) => {
  const { t } = useCustomerTranslation();
  const { data: cartData, clearCart } = useCartStore();

  /** 장바구니 모달 */
  const [isCartListOpen, setIsCartListOpen] = useState(false);
  /** 주문 완료 모달 */
  const [isOrderCompleteOrderData, setIsOrderCompleteOrderData] = useState<
    IOrder[] | null
  >(null);
  const [orderTotalPrice, setOrderTotalPrice] = useState<number>(0);
  /** 결제 방법 선택 모달 */
  const [isPaymentsModalOpen, setIsPaymentsModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    'card' | 'cash' | 'split' | 'payAfter' | null
  >(null);
  /** 분할 결제 모달 */
  const [isSplitPaymentModalOpen, setIsSplitPaymentModalOpen] = useState(false);

  const openPaymentModal = () => {
    if (selectedPaymentMethod === 'split') {
      setIsSplitPaymentModalOpen(true);
    }
    // setIsPaymentsModalOpen(false);
  };

  const closePaymentsModal = () => {
    setIsPaymentsModalOpen(false);
    setSelectedPaymentMethod(null);
  };

  const { mutateAsync: createTableOrder } = usePostTableOrder();
  const { shopData } = useShopData();
  const { data: deviceData } = useDeviceData();
  const { data: customerCountData } = useCustomerCountStore();
  const { refresh: refreshTableOrderHistories } = useTableOrderHistoriesData();

  /**
   * 주문 실행 로직 (onConfirm 내부 로직만 추출)
   */
  const executePostpaidOrder = async (): Promise<boolean> => {
    try {
      const calculateCartMenuPrice = (cartMenu: ICartMenu): number => {
        const options = cartMenu.selectedOptions.map((option) => ({
          optionPrice: option.optionPrice,
          quantity: option.quantity,
          isMenuQuantityDependant: option.isMenuQuantityDependant,
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
          isMenuQuantityDependant: selectedOption.isMenuQuantityDependant,
          quantity: selectedOption.quantity,
        })),
      }));

      await createTableOrder({
        shopCode: shopData?.shopCode ?? '',
        tableNumber: deviceData?.tableNumber ?? 0,
        orderType: 'MENU',
        // 객수 미사용시 1명으로 처리
        customerCount: customerCountData?.adultCount ?? 1,
        // 객수 미사용시 0명으로 처리
        kidsCustomerCount: customerCountData?.childCount ?? 0,
        totalAmount: calculateTotalPrice(),
        orders: orders.map((order) => ({
          ...order,
          selectedOptions: order.selectedOptions.map((option) => ({
            ...option,
            quantity: option.isMenuQuantityDependant
              ? option.quantity
              : order.quantity * option.quantity,
          })),
        })),
      });

      await refreshTableOrderHistories();
      const totalPrice = calculateTotalPrice();
      setIsOrderCompleteOrderData(orders);
      setOrderTotalPrice(totalPrice);
      clearCart();
      setIsCartListOpen(false);
      return true;
    } catch (_error) {
      return false;
    }
  };

  return (
    <>
      <S.Container type="button" onClick={() => setIsCartListOpen(true)}>
        <p>{t('장바구니')}</p>
        <p>{cartData.menus.reduce((acc, curr) => acc + curr.quantity, 0)}</p>
      </S.Container>

      {/* 장바구니 모달 */}
      {isCartListOpen && (
        <CartList
          onClose={() => setIsCartListOpen(false)}
          executePostpaidOrder={executePostpaidOrder}
          categories={categories}
          openPaymentsModal={() => setIsPaymentsModalOpen(true)}
        />
      )}

      {/* 결제 방법 선택 모달 */}
      {isPaymentsModalOpen && (
        <PaymentsModal
          onClose={closePaymentsModal}
          selectedPaymentMethod={selectedPaymentMethod}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
          openNextModal={openPaymentModal}
        />
      )}

      {/* 분할 결제 모달 */}
      {isSplitPaymentModalOpen && (
        <SplitPaymentModal onClose={() => setIsSplitPaymentModalOpen(false)} />
      )}

      {/* 주문 완료 모달 */}
      {isOrderCompleteOrderData && (
        <OrderCompleteModal
          onClose={() => setIsOrderCompleteOrderData(null)}
          orderData={isOrderCompleteOrderData}
          totalPrice={orderTotalPrice}
        />
      )}
    </>
  );
};
