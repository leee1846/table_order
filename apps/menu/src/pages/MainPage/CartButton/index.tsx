import { useState, useMemo } from 'react';
import type {
  ICategoryWithMenus,
  IOrder,
  ICancelOrderMenuRequest,
} from '@repo/api/types';
import { usePostTableOrder } from '@repo/api/queries';
import type { ICartMenu } from '@/types/cart';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { useCartStore } from '@/stores/useCartStore';
import { useCustomerCountStore } from '@/stores/useCustomerCountStore';
import { useModalStore } from '@/stores/useModalStore';
import {
  buildMenuSeqToCategoryMenuMap,
  calculateMenuTotalPrice,
  convertCartMenusToAdjustedOrders,
  isOptionGroupIndependentInCategoryMenu,
} from '@/utils/calculation';
import { CartList } from '@/pages/MainPage/CartList';
import { PaymentsModal } from '@/pages/MainPage/PaymentsModal';
import { SplitPaymentModal } from '@/pages/MainPage/SplitPaymentModal';
import * as S from '@/pages/MainPage/CartButton/cartButton.style';
import { ROUTES } from '@/constants/routes';
import { useNavigate } from 'react-router-dom';
import { useShopStore } from '@/stores/useShopStore';
import { useShopDetailStore } from '@/stores/useShopDetailStore';
import { useDeviceStore } from '@/stores/useDeviceStore';
import { toast } from '@repo/feature/utils';
import { TABLE_REMOVED_STATUS_CODE } from '@/constants/common';

interface Props {
  categories: ICategoryWithMenus[];
}

export const CartButton = ({ categories }: Props) => {
  const navigate = useNavigate();
  const { t } = useCustomerTranslation();
  const { data: cartData } = useCartStore();
  const { data: modalData, setModalData } = useModalStore();
  const { mutateAsync: createTableOrder } = usePostTableOrder({
    skipGlobalErrorHandling: true,
  });
  const { data: shopData } = useShopStore();
  const { data: customerCountData } = useCustomerCountStore();
  /** 결제 방법 선택 모달 */
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    'card' | 'cash' | 'split' | 'payAfter' | null
  >(null);

  // menuSeq → 카테고리 메뉴 맵 (isMenuQuantityIndependent 조회용, categories 변경 시에만 재빌드)
  const menuSeqToCategoryMenuMap = useMemo(
    () => buildMenuSeqToCategoryMenuMap(categories),
    [categories]
  );

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

  const calculateTotalPrice = (): number => {
    return cartData.menus.reduce((total, menu) => {
      return total + calculateCartMenuPrice(menu);
    }, 0);
  };

  /**
   * 주문 실행 로직 (onConfirm 내부 로직만 추출)
   */
  const executePostpaidOrder = async (): Promise<{
    orderGroupUuid: string;
    orderUuid: string;
    result: boolean;
    totalPrice: number;
    orders: IOrder[];
    cancelOrderMenuRequest: ICancelOrderMenuRequest;
  }> => {
    try {
      const totalPrice = calculateTotalPrice();
      const adjustedOrders = convertCartMenusToAdjustedOrders(
        cartData.menus,
        categories
      );

      const response = await createTableOrder({
        shopCode: shopData?.shopCode ?? '',
        tableNumber: useDeviceStore.getState().data?.tableNumber ?? '',
        orderType: 'MENU',
        // 객수 미사용시 1명으로 처리
        customerCount: customerCountData?.adultCount ?? 1,
        // 객수 미사용시 0명으로 처리
        kidsCustomerCount: customerCountData?.childCount ?? 0,
        totalAmount: totalPrice.toString(),
        orders: adjustedOrders,
      }).catch((error) => {
        if (error.response?.data?.status?.code === TABLE_REMOVED_STATUS_CODE) {
          // 삭제된 테이블일경우
          navigate(ROUTES.TABLES.generate());
          return;
        }
        throw error;
      });

      const orderDetailMenuList =
        response?.data?.orderInfoList.at(-1)?.orderDetailMenuList ?? [];
      const cancelOrderMenuRequest: ICancelOrderMenuRequest =
        orderDetailMenuList.map((menu) => ({
          orderDetailMenuSeq: menu.orderDetailMenuSeq,
          canceledQuantity: menu.menuQuantity,
        }));

      // 모달 표시용 orders: 주문 시점의 isMenuQuantityIndependent 값을 categories에서 스냅샷
      const orders: IOrder[] = cartData.menus.map((menu) => {
        const categoryMenu = menuSeqToCategoryMenuMap.get(menu.menuSeq);
        return {
          menuSeq: menu.menuSeq,
          menuName: menu.menuName,
          menuPrice: menu.menuPrice,
          quantity: menu.quantity,
          selectedOptions: menu.selectedOptions.map((opt) => ({
            optionSeq: opt.optionSeq,
            optionGroupSeq: opt.optionGroupSeq,
            optionName: opt.optionName,
            optionPrice: opt.optionPrice,
            quantity: opt.quantity,
            isMenuQuantityIndependent: isOptionGroupIndependentInCategoryMenu(
              categoryMenu,
              opt.optionGroupSeq
            ),
          })),
        };
      });

      return {
        result: true,
        orderGroupUuid: response?.data?.orderGroupUuid ?? '',
        orderUuid: response?.data?.orderInfoList.at(-1)?.orderUuid ?? '',
        totalPrice,
        orders,
        cancelOrderMenuRequest,
      };
    } catch (_error) {
      return {
        result: false,
        orderGroupUuid: '',
        orderUuid: '',
        totalPrice: 0,
        orders: [],
        cancelOrderMenuRequest: [],
      };
    }
  };

  const handleCartButtonClick = () => {
    if (
      !useShopDetailStore.getState().data?.shopSetting?.isMenuboardOrderable
    ) {
      toast(t('주문하기 기능이 비활성화 되었습니다.'), {
        position: 'center-center',
        duration: 1500,
      });
      return;
    }
    setModalData('isCartListOpened', true);
  };

  const handleCartListClose = () => {
    setModalData('isCartListOpened', false);
  };

  const handlePaymentsModalOpen = () => {
    handleCartListClose();
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
    </>
  );
};
