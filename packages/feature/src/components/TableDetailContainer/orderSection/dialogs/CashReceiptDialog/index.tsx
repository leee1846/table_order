import { useState } from 'react';
import {
  BasicButton,
  ModalBackground,
  Keypad,
  toast,
} from '@repo/ui/components';
import { CloseIcon, ArrowBackIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from './cashReceiptDialog.styles';

const { colors } = theme;

export type CashReceiptType = 'none' | 'individual' | 'business';

export type CashReceiptDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (type: CashReceiptType, number?: string) => void;
};

export const CashReceiptDialog = ({
  isOpen,
  onClose,
  onComplete,
}: CashReceiptDialogProps) => {
  const [receiptType, setReceiptType] = useState<CashReceiptType>('none');
  const [number, setNumber] = useState<string>('');

  // 숫자만 추출 (공백 제거)
  const getDigitsOnly = (value: string) => value.replace(/\s/g, '');

  // 전화번호 포맷팅 함수
  const formatPhoneNumber = (digits: string): string => {
    const digitsOnly = getDigitsOnly(digits);

    if (digitsOnly.length === 11) {
      // 11자리: 010 1234 5679
      return `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3, 7)} ${digitsOnly.slice(7, 11)}`;
    } else if (digitsOnly.length === 10) {
      // 10자리: 02 1234 5678
      return `${digitsOnly.slice(0, 2)} ${digitsOnly.slice(2, 6)} ${digitsOnly.slice(6, 10)}`;
    }

    return digitsOnly;
  };

  const handleNumberPress = (num: number) => {
    const digitsOnly = getDigitsOnly(number);

    // 최대 11자리까지만 입력 가능
    if (digitsOnly.length >= 11) {
      return;
    }

    if (number === '') {
      setNumber(num.toString());
    } else {
      setNumber((prev) => {
        const prevDigits = getDigitsOnly(prev);
        return `${prevDigits}${num.toString()}`;
      });
    }
  };

  const handleBackspace = () => {
    const digitsOnly = getDigitsOnly(number);

    if (digitsOnly.length <= 1) {
      setNumber('');
    } else {
      setNumber(digitsOnly.slice(0, -1));
    }
  };

  const handleComplete = () => {
    if (receiptType === 'none') {
      // 발행 안함 선택 시 바로 완료 처리
      onComplete('none');
    } else {
      const digitsOnly = getDigitsOnly(number);
      if (digitsOnly === '') {
        // 번호가 입력되지 않았으면 완료 불가
        toast('번호를 입력해주세요.');
        return;
      }
      // 완료 시 포맷팅된 번호 전달
      onComplete(receiptType, formatPhoneNumber(number));
      handleClose();
    }
  };

  const handleClose = () => {
    setReceiptType('none');
    setNumber('');
    onClose();
  };

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
            <S.SectionTitle $variant="left">현금영수증</S.SectionTitle>
            <S.Subtitle>발행 여부 선택</S.Subtitle>
            <S.OptionButtons>
              <S.OptionButton
                $isSelected={receiptType === 'none'}
                onClick={() => {
                  setReceiptType('none');
                  setNumber('');
                }}
              >
                발행 안함
              </S.OptionButton>
              <S.OptionButton
                $isSelected={receiptType === 'individual'}
                onClick={() => {
                  setReceiptType('individual');
                  setNumber('');
                }}
              >
                개인
              </S.OptionButton>
              <S.OptionButton
                $isSelected={receiptType === 'business'}
                onClick={() => {
                  setReceiptType('business');
                  setNumber('');
                }}
              >
                사업자
              </S.OptionButton>
            </S.OptionButtons>
          </S.LeftSection>

          <S.RightSection>
            <S.TopSection>
              <S.SectionTitle $variant="right">번호 입력</S.SectionTitle>
              <S.NumberDisplay $isPlaceholder={number === ''}>
                {number === '' ? '010' : formatPhoneNumber(number)}
              </S.NumberDisplay>
            </S.TopSection>
            <S.KeypadWrapper>
              <Keypad
                onNumberPress={handleNumberPress}
                bottomLeftLabel="010"
                bottomLeftAction={() => {
                  setNumber('010');
                }}
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
                onClick={handleComplete}
                fullWidth
              >
                완료
              </BasicButton>
            </S.Footer>
          </S.RightSection>
        </S.ContentWrapper>
      </S.DialogContainer>
    </ModalBackground>
  );
};
