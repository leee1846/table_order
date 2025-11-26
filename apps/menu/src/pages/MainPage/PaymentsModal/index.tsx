import { BasicButton, ModalBackground } from '@repo/ui/components';
import { useTranslation } from 'react-i18next';
import * as S from '@/pages/MainPage/PaymentsModal/paymentsModal.style';
import {
  cardIcon,
  currencyIcon,
  splitIcon,
  payAfterIcon,
} from '@repo/ui/icons';
import { css } from '@emotion/react';

interface Props {
  onClose: () => void;
  selectedPaymentMethod: 'card' | 'cash' | 'split' | 'payAfter';
  setSelectedPaymentMethod: (
    method: 'card' | 'cash' | 'split' | 'payAfter'
  ) => void;
  openNextModal: () => void;
}
export const PaymentsModal = ({
  onClose,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  openNextModal,
}: Props) => {
  const { t } = useTranslation();

  const onClickNext = () => {
    onClose();
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
          <S.PaymentMethodItem
            type="button"
            isSelected={selectedPaymentMethod === 'cash'}
            onClick={() => setSelectedPaymentMethod('cash')}
          >
            <img src={currencyIcon} alt="현금 결제" />
            {t('현금 결제')}
          </S.PaymentMethodItem>
          <S.PaymentMethodItem
            type="button"
            isSelected={selectedPaymentMethod === 'split'}
            onClick={() => setSelectedPaymentMethod('split')}
          >
            <img src={splitIcon} alt="나눠서 결제" />
            {t('나눠서 결제')}
          </S.PaymentMethodItem>
          <S.PaymentMethodItem
            type="button"
            isSelected={selectedPaymentMethod === 'payAfter'}
            onClick={() => setSelectedPaymentMethod('payAfter')}
          >
            <img src={payAfterIcon} alt="후불 결제" />
            {t('후불 결제')}
          </S.PaymentMethodItem>
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
