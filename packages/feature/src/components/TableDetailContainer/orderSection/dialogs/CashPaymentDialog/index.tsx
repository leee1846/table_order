import { useState } from 'react';
import { BasicButton, ModalBackground, Keypad } from '@repo/ui/components';
import { CloseIcon, ArrowBackIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from './cashPaymentDialog.styles';
import { formatCurrency } from '@repo/util';

const { colors } = theme;

export type CashPaymentDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  paymentAmount: number;
  onNext?: (receivedAmount: number) => void;
};

export const CashPaymentDialog = ({
  isOpen,
  onClose,
  paymentAmount,
  onNext,
}: CashPaymentDialogProps) => {
  const [receivedAmount, setReceivedAmount] = useState<string>('0');

  const handleNumberPress = (number: number) => {
    if (receivedAmount === '0') {
      setReceivedAmount(number.toString());
    } else {
      setReceivedAmount((prev) => `${prev}${number.toString()}`);
    }
  };

  const handleDoubleZero = () => {
    if (receivedAmount === '0') {
      setReceivedAmount('0');
    } else {
      setReceivedAmount((prev) => `${prev}00`);
    }
  };

  const handleBackspace = () => {
    if (receivedAmount.length === 1) {
      setReceivedAmount('0');
    } else {
      setReceivedAmount((prev) => prev.slice(0, -1));
    }
  };

  const handleNext = () => {
    const numericReceivedAmount = parseInt(receivedAmount, 10) || 0;
    if (numericReceivedAmount >= paymentAmount) {
      onNext?.(numericReceivedAmount);
    }
  };

  const handleClose = () => {
    setReceivedAmount('0');
    onClose();
  };

  const numericReceivedAmount = parseInt(receivedAmount, 10) || 0;
  const change = Math.max(0, numericReceivedAmount - paymentAmount);

  if (!isOpen) {
    return null;
  }

  return (
    <ModalBackground position="center" onClick={handleClose}>
      <S.DialogContainer onClick={(e) => e.stopPropagation()}>
        <S.CloseButton onClick={handleClose} aria-label="닫기">
          <CloseIcon width={32} height={32} color={colors.grey[700]} />
        </S.CloseButton>

        <S.ContentWrapper>
          <S.LeftSection>
            <S.SectionTitle $variant="left">현금 결제</S.SectionTitle>
            <S.PaymentInfoSection>
              <S.PaymentInfoLabel>결제 정보</S.PaymentInfoLabel>
              <S.PaymentInfoRow>
                <S.PaymentLabel>결제 금액</S.PaymentLabel>
                <S.PaymentAmount>
                  {formatCurrency(paymentAmount)}
                </S.PaymentAmount>
              </S.PaymentInfoRow>
              <S.PaymentInfoRow>
                <S.PaymentLabel>받은 금액</S.PaymentLabel>
                <S.ReceivedAmount>
                  {formatCurrency(numericReceivedAmount)}
                </S.ReceivedAmount>
              </S.PaymentInfoRow>
            </S.PaymentInfoSection>
            <S.ChangeSection>
              <S.ChangeLabel>거스름돈</S.ChangeLabel>
              <S.ChangeAmount>{formatCurrency(change)}</S.ChangeAmount>
            </S.ChangeSection>
          </S.LeftSection>

          <S.RightSection>
            <S.TopSection>
              <S.SectionTitle $variant="right">받은 금액 입력</S.SectionTitle>
              <S.AmountDisplay $isPlaceholder={receivedAmount === '0'}>
                {formatCurrency(numericReceivedAmount)}원
              </S.AmountDisplay>
            </S.TopSection>
            <S.KeypadWrapper>
              <Keypad
                onNumberPress={handleNumberPress}
                bottomLeftLabel="00"
                bottomLeftAction={handleDoubleZero}
                bottomRightAction={handleBackspace}
                bottomRightIcon={
                  <ArrowBackIcon
                    width={24}
                    height={24}
                    color={colors.grey[900]}
                  />
                }
              />
            </S.KeypadWrapper>
            <S.Footer>
              <BasicButton
                variant="Solid_Navy_2XL"
                onClick={handleNext}
                fullWidth
              >
                다음
              </BasicButton>
            </S.Footer>
          </S.RightSection>
        </S.ContentWrapper>
      </S.DialogContainer>
    </ModalBackground>
  );
};
