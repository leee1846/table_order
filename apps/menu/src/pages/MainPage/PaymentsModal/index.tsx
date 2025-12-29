import { BasicButton, ModalBackground } from '@repo/ui/components';
import * as S from '@/pages/MainPage/PaymentsModal/paymentsModal.style';
import {
  cardIcon,
  currencyIcon,
  splitIcon,
  payAfterIcon,
} from '@repo/ui/icons';
import { css } from '@emotion/react';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { openDualActionDialog } from '@repo/feature/utils';
import { usePostPayment } from '@repo/api/queries';

interface Props {
  onClose: () => void;
  selectedPaymentMethod: 'card' | 'cash' | 'split' | 'payAfter' | null;
  setSelectedPaymentMethod: (
    method: 'card' | 'cash' | 'split' | 'payAfter'
  ) => void;
  openNextModal: () => void;
  executePostpaidOrder: () => Promise<{
    orderGroupUuid: string;
    result: boolean;
    totalPrice: number;
  }>;
}

export const PaymentsModal = ({
  onClose,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  openNextModal,
  executePostpaidOrder,
}: Props) => {
  const { t } = useCustomerTranslation();
  const { data: shopDetailData } = useShopDetailData();
  const { mutateAsync: postPayment } = usePostPayment();

  const onClickNext = () => {
    if (selectedPaymentMethod === 'cash') {
      openDualActionDialog({
        title: t('현금 결제'),
        content: t('현금 결제로 주문하시겠습니까?'),
        primaryText: t('주문하기'),
        secondaryText: t('취소'),
        onConfirm: async () => {
          const response = await executePostpaidOrder();
          if (response.result) {
            postPayment({
              orderGroupUuid: response.orderGroupUuid,
              paymentType: 'CASH',
              transactionAmount: response.totalPrice,
            });
            onClose();
          }
        },
      });
      return;
    }

    // onClose();
    openNextModal();
  };

  return (
    <ModalBackground position="center" onClick={onClose}>
      <S.Container>
        <S.Title>{t('결제 방법을 선택해주세요')}</S.Title>
        <S.PaymentMethodList>
          <S.PaymentMethodItem
            type="button"
            isSelected={selectedPaymentMethod === 'card'}
            onClick={() => setSelectedPaymentMethod('card')}
          >
            <img src={cardIcon} alt="카드 결제" />
            {t('카드 결제')}
          </S.PaymentMethodItem>
          {shopDetailData?.shopSetting?.usePrepaymentCashPayment && (
            <S.PaymentMethodItem
              type="button"
              isSelected={selectedPaymentMethod === 'cash'}
              onClick={() => setSelectedPaymentMethod('cash')}
            >
              <img src={currencyIcon} alt="현금 결제" />
              {t('현금 결제')}
            </S.PaymentMethodItem>
          )}
          {shopDetailData?.shopSetting?.usePrepaymentDutch && (
            <S.PaymentMethodItem
              type="button"
              isSelected={selectedPaymentMethod === 'split'}
              onClick={() => setSelectedPaymentMethod('split')}
            >
              <img src={splitIcon} alt="나눠서 결제" />
              {t('나눠서 결제')}
            </S.PaymentMethodItem>
          )}
          {shopDetailData?.shopSetting?.usePrepaymentDeferredPayment && (
            <S.PaymentMethodItem
              type="button"
              isSelected={selectedPaymentMethod === 'payAfter'}
              onClick={() => setSelectedPaymentMethod('payAfter')}
            >
              <img src={payAfterIcon} alt="후불 결제" />
              {t('후불 결제')}
            </S.PaymentMethodItem>
          )}
        </S.PaymentMethodList>
        <BasicButton
          variant="Solid_Blue_2XL"
          onClick={onClickNext}
          customStyle={css`
            width: 100%;
          `}
        >
          {t('다음')}
        </BasicButton>
      </S.Container>
    </ModalBackground>
  );
};
