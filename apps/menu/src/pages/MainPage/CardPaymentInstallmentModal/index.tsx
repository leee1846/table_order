import { useState, useEffect } from 'react';
import { ModalBackground } from '@repo/ui/components';
import { CloseIcon } from '@repo/ui/icons';
import { useThemeMode } from '@repo/ui';
import {
  Payment,
  type IPaymentResponse,
  // type IPaymentEventData,
} from '@repo/util/app';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { useModalStore } from '@/stores/useModalStore';
// import { CardPaymentProgressModal } from '../CardPaymentProgressModal';
import { usePostPaymentApproval, usePostTableOrder } from '@repo/api/queries';
import { openConfirmDialog, toast } from '@repo/feature/utils';
import { useShopData } from '@/hooks/useShopData';
import { useDeviceData } from '@/hooks/useDeviceData';
import { useCartStore } from '@/stores/useCartStore';
import { useCustomerCountStore } from '@/stores/useCustomerCountStore';
import type { IOrder } from '@repo/api/types';
import type { ICartMenu } from '@/types/cart';
import { ROUTES } from '@/constants/routes';
import { useNavigate } from 'react-router-dom';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import {
  INSTALLMENT_MINIMUM_AMOUNT,
  INSTALLMENT_LUMP_SUM,
  formatInstallmentMonthsToString,
  InstallmentModalContent,
  DialogContainer,
  CloseButton,
} from '@/feature/Installment';

const ORDER_TYPE_PREPAYMENT = 'PREPAYMENT';
// const PAYMENT_EVENT_NAME = 'paymentEvent';
const HTTP_STATUS_BAD_REQUEST = 400;
const HTTP_STATUS_SERVER_ERROR = 500;
const HTTP_STATUS_NOT_FOUND = 404;

interface CardPaymentInstallmentModalProps {
  onClose: () => void;
  totalPrice: number;
}

/**
 * 장바구니 데이터를 주문 데이터 형식으로 변환
 */
const convertCartMenusToOrders = (cartMenus: ICartMenu[]): IOrder[] => {
  return cartMenus.map((menu: ICartMenu) => ({
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

/**
 * 주문 옵션 수량을 주문 수량에 맞게 조정 (백엔드 요구 사항)
 * (메뉴 수량 × 옵션 수량)
 */
const adjustOrderOptionQuantities = (orders: IOrder[]): IOrder[] => {
  return orders.map((order) => ({
    ...order,
    selectedOptions: order.selectedOptions.map((option) => ({
      ...option,
      quantity: order.quantity * option.quantity,
    })),
  }));
};

export const CardPaymentInstallmentModal = ({
  onClose,
  totalPrice,
}: CardPaymentInstallmentModalProps) => {
  const { t } = useCustomerTranslation();
  const { theme } = useThemeMode();
  const navigate = useNavigate();
  const modalStore = useModalStore();

  const { shopData } = useShopData();
  const { data: shopDetailData } = useShopDetailData();
  const { data: deviceData } = useDeviceData();

  const { data: cartData } = useCartStore();
  const { data: customerCountData } = useCustomerCountStore();
  const { clearCart } = useCartStore();

  const { mutateAsync: createTableOrder } = usePostTableOrder({
    ignoreGlobalErrors: [HTTP_STATUS_BAD_REQUEST],
  });
  const { mutateAsync: postPaymentApproval } = usePostPaymentApproval();

  // const [paymentProgressMessage, setPaymentProgressMessage] =
  //   useState<string>('');
  const [selectedInstallmentMonths, setSelectedInstallmentMonths] =
    useState<number>(INSTALLMENT_LUMP_SUM);

  // const paymentListenerRef = useRef<{ remove: () => Promise<void> } | null>(
  //   null
  // );

  const shouldShowInstallmentSection = totalPrice >= INSTALLMENT_MINIMUM_AMOUNT;
  const isPaymentProgressModalOpen =
    modalStore.data.isCardPaymentProgressModalOpened;

  const getOrdersFromCart = (): IOrder[] => {
    return convertCartMenusToOrders(cartData.menus);
  };

  // 결제 진행 모달 오픈 시 결제 이벤트 리스너 설정
  useEffect(() => {
    if (!isPaymentProgressModalOpen) {
      return;
    }

    // let paymentListener: { remove: () => Promise<void> } | null = null;

    // const setupPaymentListener = async () => {
    //   paymentListener = await Payment.addListener(
    //     PAYMENT_EVENT_NAME,
    //     (eventData: IPaymentEventData) => {
    //       setPaymentProgressMessage(eventData.EVENT_MSG);
    //     }
    //   );
    //   paymentListenerRef.current = paymentListener;
    // };

    // setupPaymentListener();

    return () => {
      Payment.stop();
      // if (paymentListener) {
      //   paymentListener.remove();
      // }
    };
  }, [isPaymentProgressModalOpen]);

  const createOrder = async () => {
    const orders = getOrdersFromCart();
    const adjustedOrders = adjustOrderOptionQuantities(orders);

    const orderResponse = await createTableOrder({
      shopCode: shopData?.shopCode ?? '',
      tableNumber: deviceData?.tableNumber ?? '',
      orderType: ORDER_TYPE_PREPAYMENT,
      customerCount: customerCountData?.adultCount ?? 1,
      kidsCustomerCount: customerCountData?.childCount ?? 0,
      totalAmount: totalPrice.toString(),
      orders: adjustedOrders,
    }).catch((error) => {
      // 테이블이 삭제된 경우
      if (error.response?.status === HTTP_STATUS_BAD_REQUEST) {
        navigate(ROUTES.TABLES.generate());
      }
    });

    const orderGroupUuid = orderResponse?.data?.orderGroupUuid;
    const orderUuid = orderResponse?.data?.orderInfoList[0]?.orderUuid;

    if (!orderGroupUuid || !orderUuid) {
      openConfirmDialog({
        title: t('오류'),
        content: t('주문 생성에 실패했습니다.'),
        confirmText: t('확인'),
      });
      throw new Error('주문 생성에 실패했습니다.');
    }

    return { orderGroupUuid, orderUuid };
  };

  const processPayment = async () => {
    modalStore.setModalData('isCardPaymentProgressModalOpened', true);

    const paymentResult: IPaymentResponse = await Payment.approve({
      amount: totalPrice,
      installment: formatInstallmentMonthsToString(selectedInstallmentMonths),
    });

    const { orderGroupUuid, orderUuid } = await createOrder();

    try {
      await postPaymentApproval({
        params: {
          paymentMethodCode: shopDetailData?.shopSetting?.vanCode ?? 'EASY',
          orderGroupUuid,
          orderUuid,
        },
        data: paymentResult,
        ignoreGlobalErrors: [
          HTTP_STATUS_BAD_REQUEST,
          HTTP_STATUS_SERVER_ERROR,
          HTTP_STATUS_NOT_FOUND,
        ],
      });
    } catch {
      // postPaymentApproval 실패 시 앱 결제 취소 요청
      await Payment.cancel({
        amount: totalPrice,
        orgApprNum: paymentResult.APPROVAL_NUM,
        orgApprDate: paymentResult.APPROVAL_DATE.substring(0, 6),
        tranNo: paymentResult.TRAN_NO,
      });

      throw new Error('결제 처리 중 오류가 발생했습니다.');
    }

    return paymentResult;
  };

  const handlePaymentSuccess = () => {
    const orderData = getOrdersFromCart();

    toast(t('결제를 성공했습니다.'), {
      duration: 1500,
      position: 'center-center',
    });

    // 주문 완료 모달을 위한 데이터 저장
    modalStore.setModalData('orderCompleteData', orderData);
    modalStore.setModalData('orderCompleteTotalPrice', totalPrice);
    modalStore.setModalData('isOrderCompleteModalOpened', true);

    // 모든 모달 닫기
    modalStore.setModalData('isCardPaymentProgressModalOpened', false);
    modalStore.setModalData('isPaymentsModalOpened', false);
    modalStore.setModalData('isCartListOpened', false);
    modalStore.setModalData('isCardPaymentInstallmentModalOpened', false);

    // 장바구니 비우기
    clearCart();

    // 현재 모달 닫기
    onClose();
  };

  const handlePaymentError = (error: unknown) => {
    modalStore.setModalData('isCardPaymentProgressModalOpened', false);

    const errorMessage =
      error instanceof Error
        ? error.message
        : t('결제 처리 중 오류가 발생했습니다.');

    openConfirmDialog({
      title: t('오류'),
      content: errorMessage,
      confirmText: t('확인'),
    });
  };

  const handleConfirmPayment = async () => {
    try {
      await processPayment();
      handlePaymentSuccess();
    } catch (error) {
      // 사용자가 결제를 직접 취소했을 경우
      if (
        (error as Error).message === 'USER_CANCEL' &&
        (error as unknown as { code: string }).code === 'CANCELED'
      ) {
        return;
      }

      handlePaymentError(error);
    }
  };

  // const handleClosePaymentProgressModal = () => {
  //   modalStore.setModalData('isCardPaymentProgressModalOpened', false);
  // };

  const handleInstallmentChange = (value: string | number) => {
    setSelectedInstallmentMonths(value as number);
  };

  return (
    <>
      <ModalBackground position="center">
        <DialogContainer onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={onClose} aria-label={t('닫기')}>
            <CloseIcon width={32} height={32} color={theme.mode.grey[700]} />
          </CloseButton>

          <InstallmentModalContent
            totalPrice={totalPrice}
            selectedInstallmentMonths={selectedInstallmentMonths}
            onInstallmentChange={handleInstallmentChange}
            showInstallmentSection={shouldShowInstallmentSection}
            onConfirm={handleConfirmPayment}
          />
        </DialogContainer>
      </ModalBackground>

      {/* {isPaymentProgressModalOpen && (
        <CardPaymentProgressModal
          onClose={handleClosePaymentProgressModal}
          message={paymentProgressMessage}
        />
      )} */}
    </>
  );
};
