import { useState } from 'react';
import { BasicButton, ModalBackground, Keypad } from '@repo/ui/components';
import { CloseIcon, ArrowBackIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from './amountChangeDialog.styles';
import { formatCurrency } from '@repo/util';

const { colors } = theme;

export type AmountChangeDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onApply: (amount: number) => void;
};

export const AmountChangeDialog = ({
  isOpen,
  onClose,
  onApply,
}: AmountChangeDialogProps) => {
  const [amount, setAmount] = useState<string>('0');
  const [isNegative, setIsNegative] = useState(false);

  const handleNumberPress = (number: number) => {
    if (amount === '0') {
      setAmount(number.toString());
    } else {
      setAmount((prev) => prev + number.toString());
    }
  };

  const handleToggleSign = () => {
    setIsNegative((prev) => !prev);
  };

  const handleBackspace = () => {
    if (amount.length === 1) {
      setAmount('0');
    } else {
      setAmount((prev) => prev.slice(0, -1));
    }
  };

  const handleApply = () => {
    const numericAmount = parseInt(amount, 10) || 0;
    const finalAmount = isNegative ? -numericAmount : numericAmount;
    onApply(finalAmount);
    handleClose();
  };

  const handleClose = () => {
    setAmount('0');
    setIsNegative(false);
    onClose();
  };

  const numericAmount = parseInt(amount, 10) || 0;
  const finalAmount = isNegative ? -numericAmount : numericAmount;

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
          <S.Header>
            <S.Title>금액 변경</S.Title>
          </S.Header>

          <S.AmountDisplay $isPlaceholder={amount === '0'}>
            {amount === '0' ? '+/-0' : formatCurrency(finalAmount)}원
          </S.AmountDisplay>

          <S.KeypadWrapper>
            <Keypad
              onNumberPress={handleNumberPress}
              bottomLeftLabel="−/+"
              bottomLeftAction={handleToggleSign}
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
              onClick={handleApply}
              fullWidth
            >
              적용하기
            </BasicButton>
          </S.Footer>
        </S.ContentWrapper>
      </S.DialogContainer>
    </ModalBackground>
  );
};
