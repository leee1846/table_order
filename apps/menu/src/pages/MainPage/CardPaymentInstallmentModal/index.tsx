import { useState, useEffect, useRef } from 'react';
import { BasicButton, ModalBackground, Dropdown } from '@repo/ui/components';
import { CloseIcon } from '@repo/ui/icons';
import { useThemeMode } from '@repo/ui';
import { formatCurrency } from '@repo/util/string';
import {
  Payment,
  type IPaymentResponse,
  type IPaymentEventData,
} from '@repo/util/app';
import * as S from './cardPaymentInstallmentModal.style';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { useModalStore } from '@/stores/useModalStore';
import { CardPaymentProgressModal } from '../CardPaymentProgressModal';
import { usePostPaymentApproval, usePostTableOrder } from '@repo/api/queries';
import { openConfirmDialog } from '@repo/feature/utils';
import { useShopData } from '@/hooks/useShopData';
import { useDeviceData } from '@/hooks/useDeviceData';
import { useCartStore } from '@/stores/useCartStore';
import { useCustomerCountStore } from '@/stores/useCustomerCountStore';
import type { IOrder } from '@repo/api/types';
import type { ICartMenu } from '@/types/cart';
import { ROUTES } from '@/constants/routes';
import { useNavigate } from 'react-router-dom';

const INSTALLMENT_MINIMUM_AMOUNT = 50000;
const INSTALLMENT_MONTHS_STANDARD = [36, 48, 60];
const INSTALLMENT_MONTHS_MIN = 2;
const INSTALLMENT_MONTHS_MAX = 24;
const INSTALLMENT_LUMP_SUM = 0;
const INSTALLMENT_STRING_LUMP_SUM = '00';
const ORDER_TYPE_PREPAYMENT = 'PREPAYMENT';
const PAYMENT_METHOD_CODE_EASY = 'EASY';
const PAYMENT_EVENT_NAME = 'paymentEvent';
const HTTP_STATUS_BAD_REQUEST = 400;

type InstallmentOption = {
  value: string | number;
  label: string;
  disabled?: boolean;
};

interface CardPaymentInstallmentModalProps {
  onClose: () => void;
  totalPrice: number;
}

/**
 * 할부 옵션 목록 생성
 * 일시불, 2~24개월, 36/48/60개월 옵션을 포함
 */
const createInstallmentOptions = (
  translate: (key: string, params?: Record<string, string | number>) => string
): InstallmentOption[] => {
  const options: InstallmentOption[] = [
    { value: INSTALLMENT_LUMP_SUM, label: translate('일시불') },
  ];

  // 2~24개월 옵션 추가
  for (
    let month = INSTALLMENT_MONTHS_MIN;
    month <= INSTALLMENT_MONTHS_MAX;
    month++
  ) {
    options.push({
      value: month,
      label: translate('{{months}}개월', { months: month }),
    });
  }

  // 36, 48, 60개월 옵션 추가
  INSTALLMENT_MONTHS_STANDARD.forEach((month) => {
    options.push({
      value: month,
      label: translate('{{months}}개월', { months: month }),
    });
  });

  return options;
};

/**
 * 할부 개월 수를 결제 API 형식 문자열로 변환
 * @param months - 할부 개월 수 (0: 일시불, 2-24: 2~24개월, 36/48/60: 해당 개월)
 * @returns 결제 API 형식 문자열 ("00", "02"-"24", "36"/"48"/"60")
 */
const formatInstallmentMonthsToString = (months: number): string => {
  if (months === INSTALLMENT_LUMP_SUM) {
    return INSTALLMENT_STRING_LUMP_SUM;
  }

  if (months >= INSTALLMENT_MONTHS_MIN && months <= INSTALLMENT_MONTHS_MAX) {
    return months.toString().padStart(2, '0');
  }

  if (INSTALLMENT_MONTHS_STANDARD.includes(months)) {
    return months.toString();
  }

  return INSTALLMENT_STRING_LUMP_SUM;
};

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
 * 주문 옵션 수량을 주문 수량에 맞게 조정
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
  const { data: deviceData } = useDeviceData();
  const { data: cartData } = useCartStore();
  const { data: customerCountData } = useCustomerCountStore();
  const { clearCart } = useCartStore();
  const { mutateAsync: createTableOrder } = usePostTableOrder({
    ignoreGlobalErrors: [HTTP_STATUS_BAD_REQUEST],
  });
  const { mutateAsync: postPaymentApproval } = usePostPaymentApproval();

  const [paymentProgressMessage, setPaymentProgressMessage] =
    useState<string>('');
  const [selectedInstallmentMonths, setSelectedInstallmentMonths] =
    useState<number>(INSTALLMENT_LUMP_SUM);
  const paymentListenerRef = useRef<{ remove: () => Promise<void> } | null>(
    null
  );

  const installmentOptions = createInstallmentOptions(t);
  const shouldShowInstallmentSection = totalPrice > INSTALLMENT_MINIMUM_AMOUNT;
  const isPaymentProgressModalOpen =
    modalStore.data.isCardPaymentProgressModalOpened;

  // ==========================================================================
  // Data Transformation Functions
  // ==========================================================================

  const getOrdersFromCart = (): IOrder[] => {
    return convertCartMenusToOrders(cartData.menus);
  };

  useEffect(() => {
    if (!isPaymentProgressModalOpen) {
      return;
    }

    let paymentListener: { remove: () => Promise<void> } | null = null;

    const setupPaymentListener = async () => {
      paymentListener = await Payment.addListener(
        PAYMENT_EVENT_NAME,
        (eventData: IPaymentEventData) => {
          setPaymentProgressMessage(eventData.EVENT_MSG);
        }
      );
      paymentListenerRef.current = paymentListener;
    };

    setupPaymentListener();

    return () => {
      Payment.stop();
      if (paymentListener) {
        paymentListener.remove();
      }
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
      if (error.response?.status === HTTP_STATUS_BAD_REQUEST) {
        navigate(ROUTES.TABLES.generate());
      }
    });

    const orderGroupUuid = orderResponse?.data?.orderGroupUuid;
    const orderUuid = orderResponse?.data?.orderInfoList[0]?.orderUuid;

    if (!orderGroupUuid || !orderUuid) {
      throw new Error('주문 생성에 실패했습니다.');
    }

    return { orderGroupUuid, orderUuid };
  };

  const processPayment = async (orderGroupUuid: string, orderUuid: string) => {
    modalStore.setModalData('isCardPaymentProgressModalOpened', true);

    const paymentResult: IPaymentResponse = await Payment.approve({
      amount: totalPrice,
      installment: formatInstallmentMonthsToString(selectedInstallmentMonths),
    });

    await postPaymentApproval({
      params: {
        paymentMethodCode: PAYMENT_METHOD_CODE_EASY,
        orderGroupUuid,
        orderUuid,
      },
      data: paymentResult,
    });

    return paymentResult;
  };

  const handlePaymentSuccess = () => {
    const orderData = getOrdersFromCart();

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
      const { orderGroupUuid, orderUuid } = await createOrder();
      await processPayment(orderGroupUuid, orderUuid);
      handlePaymentSuccess();
    } catch (error) {
      if (
        (error as Error).message === 'USER_CANCEL' &&
        (error as unknown as { code: string }).code === 'CANCELED'
      ) {
        // 사용자가 결제를 취소했을 경우
        return;
      }

      handlePaymentError(error);
    }
  };

  const handleClosePaymentProgressModal = () => {
    modalStore.setModalData('isCardPaymentProgressModalOpened', false);
  };

  const handleInstallmentChange = (value: string | number) => {
    setSelectedInstallmentMonths(value as number);
  };

  return (
    <>
      <ModalBackground position="center" onClick={onClose}>
        <S.DialogContainer onClick={(e) => e.stopPropagation()}>
          <S.CloseButton onClick={onClose} aria-label={t('닫기')}>
            <CloseIcon width={32} height={32} color={theme.mode.grey[700]} />
          </S.CloseButton>

          <S.ContentWrapper>
            <S.Title>{t('체크·신용카드 결제')}</S.Title>

            <S.PaymentInfoSection>
              <S.PaymentInfoRow>
                <S.PaymentLabel>{t('결제 금액')}</S.PaymentLabel>
                <S.PaymentAmount>
                  {t('{{amount}}원', { amount: formatCurrency(totalPrice) })}
                </S.PaymentAmount>
              </S.PaymentInfoRow>
            </S.PaymentInfoSection>

            {shouldShowInstallmentSection && (
              <S.InstallmentSection>
                <S.InstallmentLabel>{t('할부 선택')}</S.InstallmentLabel>
                <Dropdown
                  options={installmentOptions}
                  value={selectedInstallmentMonths}
                  onChange={handleInstallmentChange}
                  customStyle={S.DropdownStyle(theme)}
                />
              </S.InstallmentSection>
            )}

            <S.Footer>
              <BasicButton
                variant="Solid_Blue_2XL"
                onClick={handleConfirmPayment}
                customStyle={S.ConfirmButtonStyle}
              >
                {t('결제하기')}
              </BasicButton>
            </S.Footer>
          </S.ContentWrapper>
        </S.DialogContainer>
      </ModalBackground>

      {isPaymentProgressModalOpen && (
        <CardPaymentProgressModal
          onClose={handleClosePaymentProgressModal}
          message={paymentProgressMessage}
        />
      )}
    </>
  );
};
