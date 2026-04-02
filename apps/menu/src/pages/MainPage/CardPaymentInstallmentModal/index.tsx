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
import { useCustomerLanguageStore } from '@/stores/useCustomerLanguageStore';
// import { CardPaymentProgressModal } from '../CardPaymentProgressModal';
import {
  usePostPaymentApproval,
  usePostTableOrder,
  usePutCancelOrderMenu,
  usePutPaymentCancel,
} from '@repo/api/queries';
import type { ICancelOrderMenuRequest, IOrder } from '@repo/api/types';
import { openConfirmDialog, toast } from '@repo/feature/utils';
import { useDeviceStore } from '@/stores/useDeviceStore';
import { useCartStore } from '@/stores/useCartStore';
import { useCustomerCountStore } from '@/stores/useCustomerCountStore';
import type { ICartMenu } from '@/types/cart';
import { ROUTES } from '@/constants/routes';
import { useNavigate } from 'react-router-dom';
import { usePosOrderStore } from '@repo/feature/stores';
import { useCategoryStore } from '@/stores/useCategoryStore';
import {
  INSTALLMENT_MINIMUM_AMOUNT,
  INSTALLMENT_LUMP_SUM,
  formatInstallmentMonthsToString,
  InstallmentModalContent,
  DialogContainer,
  CloseButton,
} from '@/feature/Installment';
import { useShopStore } from '@/stores/useShopStore';
import { useShopDetailStore } from '@/stores/useShopDetailStore';
import { useTableOrderHistoriesData } from '@/hooks/useTableOrderHistoriesData';
import { localizeOrders } from '@/utils/localizeOrders';

const ORDER_TYPE_PREPAYMENT = 'PREPAYMENT';
// const PAYMENT_EVENT_NAME = 'paymentEvent';
const HTTP_STATUS_BAD_REQUEST = 400;
const HTTP_STATUS_NOT_FOUND = 404;
const HTTP_STATUS_METHOD_NOT_ALLOWED = 405;

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

const calculateCartTaxAmount = (cartMenus: ICartMenu[]): number => {
  const categories = useCategoryStore.getState().data.categories;
  const menuSeqToIsTaxFree = new Map<number, boolean>();
  categories?.forEach((category) => {
    category.menuInfoList.forEach((menu) => {
      menuSeqToIsTaxFree.set(menu.menuSeq, menu.isTaxFree);
    });
  });

  const taxableAmount = cartMenus.reduce((sum, menu) => {
    if (menuSeqToIsTaxFree.get(menu.menuSeq) === true) {
      return sum;
    }

    const optionsTotal = menu.selectedOptions.reduce(
      (optSum, opt) => optSum + opt.optionPrice * opt.quantity,
      0
    );
    const menuUnitPrice = menu.menuPrice + optionsTotal;
    return sum + menuUnitPrice * menu.quantity;
  }, 0);

  return Math.floor(taxableAmount / 11);
};

export const CardPaymentInstallmentModal = ({
  onClose,
  totalPrice,
}: CardPaymentInstallmentModalProps) => {
  const { t } = useCustomerTranslation();
  const { theme } = useThemeMode();
  const navigate = useNavigate();
  const modalStore = useModalStore();

  const { data: shopData } = useShopStore();

  const { data: cartData } = useCartStore();
  const { data: customerCountData } = useCustomerCountStore();
  const { clearCart } = useCartStore();
  const { refresh: refreshTableOrderHistoriesData } =
    useTableOrderHistoriesData({ skipInitialRequest: true });

  const { mutateAsync: createTableOrder } = usePostTableOrder({
    ignoreGlobalErrors: [
      HTTP_STATUS_BAD_REQUEST,
      HTTP_STATUS_NOT_FOUND,
      HTTP_STATUS_METHOD_NOT_ALLOWED,
    ],
  });
  const { mutateAsync: postPaymentApproval } = usePostPaymentApproval();
  const { mutateAsync: cancelOrderMenu } = usePutCancelOrderMenu();
  const { mutateAsync: putPaymentCancel } = usePutPaymentCancel();

  // const [paymentProgressMessage, setPaymentProgressMessage] =
  //   useState<string>('');
  const [selectedInstallmentMonths, setSelectedInstallmentMonths] =
    useState<number>(INSTALLMENT_LUMP_SUM);

  // const paymentListenerRef = useRef<{ remove: () => Promise<void> } | null>(
  //   null
  // );

  const shouldShowInstallmentSection = totalPrice >= INSTALLMENT_MINIMUM_AMOUNT;

  const getOrdersFromCart = (): IOrder[] => {
    return convertCartMenusToOrders(cartData.menus);
  };

  // 결제 진행 모달 오픈 시 결제 이벤트 리스너 설정
  useEffect(() => {
    // if (!isPaymentProgressModalOpen) {
    //   return;
    // }

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
  }, []);

  const createOrder = async (): Promise<{
    orderGroupUuid: string;
    orderUuid: string;
    cancelOrderMenuRequest: ICancelOrderMenuRequest;
  }> => {
    const orders = getOrdersFromCart();
    const adjustedOrders = adjustOrderOptionQuantities(orders);

    const orderResponse = await createTableOrder({
      shopCode: shopData?.shopCode ?? '',
      tableNumber: useDeviceStore.getState().data?.tableNumber ?? '',
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
    const orderUuid = orderResponse?.data?.orderInfoList.at(-1)?.orderUuid;

    if (!orderGroupUuid || !orderUuid) {
      throw new Error('주문 생성에 실패했습니다.');
    }

    const orderDetailMenuList =
      orderResponse?.data?.orderInfoList.at(-1)?.orderDetailMenuList ?? [];
    const cancelOrderMenuRequest: ICancelOrderMenuRequest =
      orderDetailMenuList.map((menu) => ({
        orderDetailMenuSeq: menu.orderDetailMenuSeq,
        canceledQuantity: menu.menuQuantity,
      }));

    return { orderGroupUuid, orderUuid, cancelOrderMenuRequest };
  };

  const processPayment = async (): Promise<{
    paymentResult: IPaymentResponse;
    orderGroupUuid: string;
    orderUuid: string;
    cancelOrderMenuRequest: ICancelOrderMenuRequest;
    paymentSeq: number;
  }> => {
    // modalStore.setModalData('isCardPaymentProgressModalOpened', true);

    const paymentResult: IPaymentResponse = await Payment.approve({
      amount: totalPrice,
      tax: calculateCartTaxAmount(cartData.menus),
      installment: formatInstallmentMonthsToString(selectedInstallmentMonths),
    });

    let orderResult;
    try {
      orderResult = await createOrder();
    } catch {
      try {
        await Payment.cancel(paymentResult);
      } catch {
        // 카드 취소 실패 시 무시
      }
      throw new Error('결제 처리 중 오류가 발생했습니다.');
    }

    const { orderGroupUuid, orderUuid, cancelOrderMenuRequest } = orderResult;

    let paymentSeq = 0;
    try {
      const approvalResponse = await postPaymentApproval({
        params: {
          paymentMethodCode:
            useShopDetailStore.getState().data?.shopSetting?.vanCode ?? 'EASY',
          orderGroupUuid,
          orderUuid,
        },
        data: paymentResult,
      });
      paymentSeq = approvalResponse.data ?? 0;
    } catch {
      try {
        await Payment.cancel(paymentResult);
      } catch {
        // 카드 취소 실패 시 무시
      }
      throw new Error(t('주문 요청에 실패했습니다. 사장님에게 문의해주세요.'));
    }

    return {
      paymentResult,
      orderGroupUuid,
      orderUuid,
      cancelOrderMenuRequest,
      paymentSeq,
    };
  };

  const handlePaymentSuccess = async () => {
    const language = useCustomerLanguageStore.getState().data.currentLanguage;
    const orderData = localizeOrders(
      getOrdersFromCart(),
      cartData.menus,
      language
    );

    toast(t('결제를 성공했습니다.'), {
      duration: 1500,
      position: 'center-center',
    });

    // 주문 완료 모달을 위한 데이터 저장
    modalStore.setModalData('orderCompleteData', orderData);
    modalStore.setModalData('orderCompleteTotalPrice', totalPrice);
    modalStore.setModalData('isOrderCompleteFromPrepaidCardOrFinalSplit', true);

    // 장바구니 비우기
    clearCart();

    // 모든 모달 닫기
    // modalStore.setModalData('isCardPaymentProgressModalOpened', false);
    modalStore.setModalData('isPaymentsModalOpened', false);
    modalStore.setModalData('isCartListOpened', false);
    modalStore.setModalData('isCardPaymentInstallmentModalOpened', false);
    // 모달이 열리는 시점의 언어를 고정 — OrderCompleteModal에서 이 값으로 번역 표시
    modalStore.setModalData('orderCompleteLanguage', language);
    modalStore.setModalData('isOrderCompleteModalOpened', true);

    // 현재 모달 닫기
    onClose();
    await refreshTableOrderHistoriesData();
  };

  const handlePaymentError = (error: unknown) => {
    // modalStore.setModalData('isCardPaymentProgressModalOpened', false);

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

  const handleOrderCompleteFailure = () => {
    openConfirmDialog({
      title: t('POS 오류'),
      content: t('주문 요청에 실패했습니다. 사장님에게 문의해주세요.'),
      confirmText: t('확인'),
    });
  };

  const handleConfirmPayment = async () => {
    try {
      const {
        paymentResult,
        orderUuid,
        cancelOrderMenuRequest,
        orderGroupUuid,
        paymentSeq,
      } = await processPayment();

      const shopDetailData = useShopDetailStore.getState().data;
      const isPosLinked =
        !!shopDetailData?.shopSetting?.shopPosCode &&
        shopDetailData?.shopSetting?.shopPosCode !== 'NONE';

      if (isPosLinked) {
        const shopCode = String(shopData?.shopCode ?? '');
        usePosOrderStore
          .getState()
          .register(orderUuid, shopCode, handlePaymentSuccess, async () => {
            // POS 실패(-603 또는 API 에러) / 타임아웃: 환불 → 환불 정보 전송 → 주문 취소
            try {
              await Payment.cancel(paymentResult);
              const cancelResult = await Payment.cancel(paymentResult);
              if (paymentSeq > 0) {
                await putPaymentCancel({
                  params: {
                    paymentMethodCode:
                      useShopDetailStore.getState().data?.shopSetting
                        ?.vanCode ?? 'EASY',
                    orderGroupUuid,
                    paymentSeq,
                  },
                  data: cancelResult,
                });
              }
              await cancelOrderMenu(cancelOrderMenuRequest);
            } catch {
              // 카드 취소 실패 시 무시 (이미 승인된 결제이므로 수동 처리 필요)
            }
            handleOrderCompleteFailure();
          });
        return;
      }

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
