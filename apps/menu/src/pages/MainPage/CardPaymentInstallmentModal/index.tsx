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
import { toast } from '@repo/feature/utils';
import { useShopData } from '@/hooks/useShopData';
import { useDeviceData } from '@/hooks/useDeviceData';
import { useCartStore } from '@/stores/useCartStore';
import { useCustomerCountStore } from '@/stores/useCustomerCountStore';
import type { IOrder } from '@repo/api/types';

// 할부 옵션 생성 (일시불, 2~24개월, 36/48/60개월)
const generateInstallmentOptions = (
  t: (key: string, params?: Record<string, string | number>) => string
): IOption[] => {
  const options: IOption[] = [{ value: 0, label: t('일시불') }];

  // 2~24개월 (1개월씩)
  for (let i = 2; i <= 24; i++) {
    options.push({ value: i, label: t('{{months}}개월', { months: i }) });
  }

  // 36, 48, 60개월
  [36, 48, 60].forEach((months) => {
    options.push({ value: months, label: t('{{months}}개월', { months }) });
  });

  return options;
};

// 할부 개월을 문자열로 변환 (0 -> "00", 2-24 -> "02"-"24", 36/48/60 -> "36"/"48"/"60")
const convertInstallmentToString = (months: number): string => {
  if (months === 0) {
    return '00';
  }
  if (months >= 2 && months <= 24) {
    return months.toString().padStart(2, '0');
  }
  if ([36, 48, 60].includes(months)) {
    return months.toString();
  }
  return '00';
};

type IOption = {
  value: string | number;
  label: string;
  disabled?: boolean;
};

interface Props {
  onClose: () => void;
  totalPrice: number;
}

export const CardPaymentInstallmentModal = ({ onClose, totalPrice }: Props) => {
  const { t } = useCustomerTranslation();
  const { theme } = useThemeMode();
  const modalStore = useModalStore();
  const { shopData } = useShopData();
  const { data: deviceData } = useDeviceData();
  const { data: cartData } = useCartStore();
  const { data: customerCountData } = useCustomerCountStore();
  const { mutateAsync: createTableOrder } = usePostTableOrder({
    ignoreGlobalErrors: [400],
  });

  const [cardPaymentProgressMessage, setCardPaymentProgressMessage] =
    useState<string>('');
  const [selectedInstallment, setSelectedInstallment] = useState<number>(0);
  const paymentListenerRef = useRef<{ remove: () => Promise<void> } | null>(
    null
  );

  const installmentOptions = generateInstallmentOptions(t);

  const { mutateAsync: postPaymentApproval } = usePostPaymentApproval();

  // CartButton의 로직을 참고하여 주문 데이터 변환 함수들

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

  // 결제 이벤트 리스너 설정
  useEffect(() => {
    if (!modalStore.data.isCardPaymentProgressModalOpened) {
      return;
    }

    let listener: { remove: () => Promise<void> } | null = null;

    const setupListener = async () => {
      listener = await Payment.addListener(
        'paymentEvent',
        (data: IPaymentEventData) => {
          setCardPaymentProgressMessage(data.EVENT_MSG);
        }
      );
      paymentListenerRef.current = listener;
    };

    setupListener();

    return () => {
      if (listener) {
        listener.remove();
      }
    };
  }, [modalStore.data.isCardPaymentProgressModalOpened]);

  const onClickConfirm = async () => {
    try {
      // 1. 주문 생성
      // const orders = convertCartDataToOrders();
      // const orderResponse = await createTableOrder({
      //   shopCode: shopData?.shopCode ?? '',
      //   tableNumber: deviceData?.tableNumber ?? '',
      //   orderType: 'MENU',
      //   customerCount: customerCountData?.adultCount ?? 1,
      //   kidsCustomerCount: customerCountData?.childCount ?? 0,
      //   totalAmount: totalPrice.toString(),
      //   orders: adjustOptionQuantitiesForOrder(orders),
      // });

      // const orderGroupUuid = orderResponse?.data?.orderGroupUuid;
      // if (!orderGroupUuid) {
      //   return;
      // }

      // 2. 진행 모달 열기
      modalStore.setModalData('isCardPaymentProgressModalOpened', true);

      // 3. 네이티브 결제 시도
      const installmentString = convertInstallmentToString(selectedInstallment);
      const paymentResult: IPaymentResponse = await Payment.approve({
        amount: totalPrice,
        installment: installmentString,
      });

      // // 4. 서버에 승인 요청
      // await postPaymentApproval({
      //   params: {
      //     paymentMethodCode: 'EASY',
      //     orderGroupUuid,
      //     orderUuid: '',
      //   },
      //   data: paymentResult,
      // });

      // 5. 성공 처리
      modalStore.setModalData('isCardPaymentProgressModalOpened', false);
      modalStore.setModalData('isPaymentsModalOpened', false);
      onClose();

      toast(t('결제가 완료되었습니다.'), {
        position: 'center-center',
        duration: 2000,
      });
    } catch (error) {
      modalStore.setModalData('isCardPaymentProgressModalOpened', false);

      toast(
        error instanceof Error
          ? error.message
          : t('결제 처리 중 오류가 발생했습니다.'),
        {
          position: 'center-center',
          duration: 2000,
        }
      );
    }
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

            <S.InstallmentSection>
              <S.InstallmentLabel>{t('할부 선택')}</S.InstallmentLabel>
              <Dropdown
                options={installmentOptions}
                value={selectedInstallment}
                onChange={(value) => setSelectedInstallment(value as number)}
                customStyle={S.DropdownStyle(theme)}
              />
            </S.InstallmentSection>

            <S.Footer>
              <BasicButton
                variant="Solid_Blue_2XL"
                onClick={onClickConfirm}
                customStyle={S.ConfirmButtonStyle}
              >
                {t('결제하기')}
              </BasicButton>
            </S.Footer>
          </S.ContentWrapper>
        </S.DialogContainer>
      </ModalBackground>

      {modalStore.data.isCardPaymentProgressModalOpened && (
        <CardPaymentProgressModal
          onClose={onClose}
          message={cardPaymentProgressMessage}
        />
      )}
    </>
  );
};
