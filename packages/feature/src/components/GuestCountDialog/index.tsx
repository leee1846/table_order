'use client';

import { useState } from 'react';
import { ModalBackground, BasicButton, NumberInput } from '@repo/ui/components';
import { CloseIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from './guestCountDialog.styles';

const { colors } = theme;

export type GuestCountDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (count: number) => void;
  initialCount?: number;
  minCount?: number;
  maxCount?: number;
};

export const GuestCountDialog = ({
  isOpen,
  onClose,
  onConfirm,
  initialCount = 1,
  minCount = 1,
  maxCount = 99,
}: GuestCountDialogProps) => {
  const [count, setCount] = useState(initialCount);

  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    onConfirm(count);
    onClose();
  };

  const handleClose = () => {
    setCount(initialCount);
    onClose();
  };

  return (
    <ModalBackground position="center" onClick={handleClose}>
      <S.DialogContainer onClick={(e) => e.stopPropagation()}>
        <S.CloseButton onClick={handleClose} aria-label="닫기">
          <CloseIcon width={32} height={32} color={colors.grey[700]} />
        </S.CloseButton>

        <S.ContentWrapper>
          <S.Header>
            <S.Title>입장하는 인원 수를 입력해주세요</S.Title>
          </S.Header>

          <S.CounterSection>
            <S.Label>
              <S.LabelText>인원 수</S.LabelText>
              <S.LabelSubtext>함께 입장 하는 인원</S.LabelSubtext>
            </S.Label>

            <S.NumberInputWrapper>
              <NumberInput
                variant="square"
                size="L"
                value={count}
                min={minCount}
                max={maxCount}
                onChange={setCount}
              />
            </S.NumberInputWrapper>
          </S.CounterSection>

          <S.Footer>
            <BasicButton
              variant="Solid_Navy_2XL"
              onClick={handleConfirm}
              fullWidth
            >
              완료
            </BasicButton>
          </S.Footer>
        </S.ContentWrapper>
      </S.DialogContainer>
    </ModalBackground>
  );
};
