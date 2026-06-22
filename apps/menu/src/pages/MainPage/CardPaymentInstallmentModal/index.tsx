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
  // usePutCancelOrderMenu,
  // usePutPaymentCancel,
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
import {
  logOrderRequestRefundFailed,
  orderRequestRefundFailedSummaryAfterOrderCreate,
  orderRequestRefundFailedSummaryAfterPaymentApproval,
  orderRequestRefundFailedSummaryAfterPosOrderFailure,
} from '@/utils/logOrderRequestRefundFailed';
import {
  buildMenuSeqToCategoryMenuMap,
  calculateCartMenusTaxAmount,
  convertCartMenusToAdjustedOrders,
  isOptionGroupIndependentInCategoryMenu,
} from '@/utils/calculation';
import { TABLE_REMOVED_STATUS_CODE } from '@/constants/common';
import {
  getKiccPaymentErrorDialogMessage,
  isKiccPaymentUserCancelError,
} from '@/utils/kiccPaymentError';

const ORDER_TYPE_PREPAYMENT = 'PREPAYMENT';
// const PAYMENT_EVENT_NAME = 'paymentEvent';
const HTTP_STATUS_BAD_REQUEST = 400;
const HTTP_STATUS_NOT_FOUND = 404;
const HTTP_STATUS_METHOD_NOT_ALLOWED = 405;

interface CardPaymentInstallmentModalProps {
  onClose: () => void;
  totalPrice: number;
}

const calculateCartTaxAmount = (cartMenus: ICartMenu[]): number => {
  return calculateCartMenusTaxAmount(
    cartMenus,
    useCategoryStore.getState().data.categories
  );
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
  // const { mutateAsync: cancelOrderMenu } = usePutCancelOrderMenu();
  // const { mutateAsync: putPaymentCancel } = usePutPaymentCancel();

  // const [paymentProgressMessage, setPaymentProgressMessage] =
  //   useState<string>('');
  const [selectedInstallmentMonths, setSelectedInstallmentMonths] =
    useState<number>(INSTALLMENT_LUMP_SUM);

  // const paymentListenerRef = useRef<{ remove: () => Promise<void> } | null>(
  //   null
  // );

  const shouldShowInstallmentSection = totalPrice >= INSTALLMENT_MINIMUM_AMOUNT;

  const getRawOrdersFromCart = (): IOrder[] => {
    // 주문 시점의 categories 기준으로 isMenuQuantityIndependent 스냅샷
    const categories = useCategoryStore.getState().data.categories;
    const menuSeqToCategoryMenuMap = buildMenuSeqToCategoryMenuMap(categories);

    return cartData.menus.map((menu) => {
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
    const adjustedOrders = convertCartMenusToAdjustedOrders(
      cartData.menus,
      useCategoryStore.getState().data.categories
    );

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
      if (error.response?.data?.status?.code === TABLE_REMOVED_STATUS_CODE) {
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

  /**
   * 카드 승인 후 단계(주문 생성·결제 승인 전송)가 실패했을 때 호출.
   * 승인된 카드 결제를 취소(환불)하고 에러를 던진다.
   * - 환불 성공: '직원에게 문의' 에러
   * - 환불 실패: 진단 로그 후 '환불 문의' 에러
   */
  const cancelPaymentAndThrow = async (
    paymentResult: IPaymentResponse,
    buildRefundFailedSummary: () => string
  ): Promise<never> => {
    try {
      await Payment.cancel(paymentResult);
    } catch {
      logOrderRequestRefundFailed(buildRefundFailedSummary(), paymentResult);
      throw new Error(
        t('주문 요청에 실패하였습니다. 환불은 직원에게 문의해주세요.')
      );
    }
    throw new Error(t('주문 요청에 실패하였습니다. 직원에게 문의해주세요.'));
  };

  const processPayment = async (): Promise<{
    paymentResult: IPaymentResponse;
    orderGroupUuid: string;
    orderUuid: string;
    cancelOrderMenuRequest: ICancelOrderMenuRequest;
    paymentSeq: number;
  }> => {
    // modalStore.setModalData('isCardPaymentProgressModalOpened', true);

    // 카드 단말기 승인 (실패 시 그대로 전파 → KICC 메시지 처리)
    const paymentResult: IPaymentResponse = await Payment.approve({
      amount: totalPrice,
      tax: calculateCartTaxAmount(cartData.menus),
      taxOption: 'M',
      installment: formatInstallmentMonthsToString(selectedInstallmentMonths),
    });

    const shopCode = shopData?.shopCode ?? '';
    const tableNumber = useDeviceStore.getState().data?.tableNumber ?? '';

    // 주문 생성 (실패 시 카드 환불 후 에러)
    const { orderGroupUuid, orderUuid, cancelOrderMenuRequest } =
      await createOrder().catch(() =>
        cancelPaymentAndThrow(paymentResult, () =>
          orderRequestRefundFailedSummaryAfterOrderCreate(shopCode, tableNumber)
        )
      );

    // 서버 결제 승인 전송 (실패 시 카드 환불 후 에러)
    const approvalResponse = await postPaymentApproval({
      params: {
        paymentMethodCode:
          useShopDetailStore.getState().data?.shopSetting?.vanCode ?? 'EASY',
        orderGroupUuid,
        orderUuid,
      },
      data: paymentResult,
    }).catch(() =>
      cancelPaymentAndThrow(paymentResult, () =>
        orderRequestRefundFailedSummaryAfterPaymentApproval(
          useShopDetailStore.getState().data?.shopSetting?.vanCode ?? 'EASY'
        )
      )
    );
    const paymentSeq = approvalResponse.data ?? 0;

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
      getRawOrdersFromCart(),
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

    const errorMessage = getKiccPaymentErrorDialogMessage(
      error,
      t('주문 요청에 실패하였습니다. 직원에게 문의해주세요.'),
      t
    );

    openConfirmDialog({
      title: t('오류'),
      content: errorMessage,
      confirmText: t('확인'),
    });
  };

  const handleOrderCompleteFailure = (paymentCancelFailed = false) => {
    openConfirmDialog({
      title: t('POS 오류'),
      content: paymentCancelFailed
        ? t('주문 요청에 실패하였습니다. 환불은 직원에게 문의해주세요.')
        : t('주문 요청에 실패하였습니다. 직원에게 문의해주세요.'),
      confirmText: t('확인'),
    });
  };

  const handleConfirmPayment = async () => {
    try {
      const {
        paymentResult,
        orderUuid,
        // cancelOrderMenuRequest,
        // orderGroupUuid,
        // paymentSeq,
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
            let paymentCancelFailed = false;
            try {
              await Payment.cancel(paymentResult);
              // const cancelResult = await Payment.cancel(paymentResult);
              // if (paymentSeq > 0) {
              //   await putPaymentCancel({
              //     params: {
              //       paymentMethodCode:
              //         useShopDetailStore.getState().data?.shopSetting
              //           ?.vanCode ?? 'EASY',
              //       orderGroupUuid,
              //       paymentSeq,
              //     },
              //     data: cancelResult,
              //   });
              // }
              // await cancelOrderMenu(cancelOrderMenuRequest);
            } catch {
              paymentCancelFailed = true;
              logOrderRequestRefundFailed(
                orderRequestRefundFailedSummaryAfterPosOrderFailure(),
                paymentResult
              );
            }
            handleOrderCompleteFailure(paymentCancelFailed);
          });
        return;
      }

      handlePaymentSuccess();
    } catch (error) {
      if (isKiccPaymentUserCancelError(error)) {
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
