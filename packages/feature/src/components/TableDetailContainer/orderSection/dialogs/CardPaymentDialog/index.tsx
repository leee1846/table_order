import { useState } from 'react';
import { BasicButton, ModalBackground, Dropdown } from '@repo/ui/components';
import { CloseIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from './cardPaymentDialog.styles';
import { formatCurrency } from '@repo/util/string';
import { CardPaymentProgressDialog } from '../CardPaymentProgressDialog';

const { colors } = theme;

type IOption = {
  value: string | number;
  label: string;
  disabled?: boolean;
};

export type CardPaymentDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  paymentAmount: number;
  billingAmount: number;
  onArbitraryPayment?: () => void;
  onConfirmPayment?: () => void;
};

// 할부 옵션 생성 (일시불 + 2개월~60개월)
const generateInstallmentOptions = (): IOption[] => {
  const options: IOption[] = [{ value: 0, label: '일시불' }];

  for (let i = 2; i <= 60; i++) {
    options.push({ value: i, label: `${i}개월` });
  }

  return options;
};

export const CardPaymentDialog = ({
  isOpen,
  onClose,
  paymentAmount,
  billingAmount,
  onArbitraryPayment,
  onConfirmPayment,
}: CardPaymentDialogProps) => {
  const [selectedInstallment, setSelectedInstallment] = useState<number>(0);
  const [isProgressDialogOpen, setIsProgressDialogOpen] = useState(false);
  const installmentOptions = generateInstallmentOptions();

  const handleArbitraryPayment = () => {
    onArbitraryPayment?.();
  };

  const handleConfirmPayment = () => {
    setIsProgressDialogOpen(true);
    onConfirmPayment?.();
  };

  const handleCloseProgressDialog = () => {
    setIsProgressDialogOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <ModalBackground position="center" onClick={onClose}>
        <S.DialogContainer onClick={(e) => e.stopPropagation()}>
          <S.CloseButton onClick={onClose} aria-label="닫기">
            <CloseIcon width={32} height={32} color={colors.grey[700]} />
          </S.CloseButton>

          <S.ContentWrapper>
            <S.Header>
              <S.Title>체크·신용카드 결제</S.Title>
            </S.Header>

            <S.PaymentInfoSection>
              <S.PaymentInfoRow>
                <S.PaymentLabel>결제 금액</S.PaymentLabel>
                <S.PaymentAmount>
                  {formatCurrency(paymentAmount)}원
                </S.PaymentAmount>
              </S.PaymentInfoRow>
              <S.PaymentInfoRow>
                <S.PaymentLabel>청구 금액</S.PaymentLabel>
                <S.PaymentAmount>
                  {formatCurrency(billingAmount)}원
                </S.PaymentAmount>
              </S.PaymentInfoRow>
            </S.PaymentInfoSection>

            <S.InstallmentSection>
              <S.InstallmentLabel>할부 선택</S.InstallmentLabel>
              <Dropdown
                options={installmentOptions}
                value={selectedInstallment}
                onChange={(value) => setSelectedInstallment(value as number)}
                customStyle={S.DropdownStyle}
              />
            </S.InstallmentSection>

            <S.Footer>
              <BasicButton
                variant="Outline_Grey_2XL"
                onClick={handleArbitraryPayment}
                customStyle={S.ConfirmButtonStyle}
              >
                임의결제
              </BasicButton>
              <BasicButton
                variant="Solid_Navy_2XL"
                onClick={handleConfirmPayment}
                customStyle={S.ConfirmButtonStyle}
              >
                결제하기
              </BasicButton>
            </S.Footer>
          </S.ContentWrapper>
        </S.DialogContainer>
      </ModalBackground>

      <CardPaymentProgressDialog
        isOpen={isProgressDialogOpen}
        onClose={handleCloseProgressDialog}
      />
    </>
  );
};
