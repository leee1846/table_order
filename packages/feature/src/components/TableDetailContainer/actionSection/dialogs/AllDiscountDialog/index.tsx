import { useState } from 'react';
import {
  BasicButton,
  ModalBackground,
  RadioButton,
  Input,
} from '@repo/ui/components';
import { CloseIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from './allDiscountDialog.styles';

const { colors } = theme;

export type AllDiscountDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onApply: (discount: number) => void;
};

const DISCOUNT_OPTIONS = [
  { value: 'custom', label: '직접 입력' },
  { value: '5', label: '5%' },
  { value: '10', label: '10%' },
  { value: '15', label: '15%' },
  { value: '20', label: '20%' },
  { value: '25', label: '25%' },
];

export const AllDiscountDialog = ({
  isOpen,
  onClose,
  onApply,
}: AllDiscountDialogProps) => {
  const [selectedDiscount, setSelectedDiscount] = useState<string>('5');
  const [customDiscount, setCustomDiscount] = useState<string>('');

  const handleDiscountChange = (value: string) => {
    setSelectedDiscount(value);
    if (value !== 'custom') {
      setCustomDiscount('');
    }
  };

  const handleApply = () => {
    let discount ;
    if (selectedDiscount === 'custom') {
      discount = parseFloat(customDiscount) || 0;
    } else {
      discount = parseFloat(selectedDiscount) || 0;
    }
    onApply(discount);
    handleClose();
  };

  const handleClose = () => {
    setSelectedDiscount('5');
    setCustomDiscount('');
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  const isCustomSelected = selectedDiscount === 'custom';

  return (
    <ModalBackground position="center" onClick={handleClose}>
      <S.DialogContainer onClick={(e) => e.stopPropagation()}>
        <S.CloseButton onClick={handleClose} aria-label="닫기">
          <CloseIcon width={32} height={32} color={colors.grey[700]} />
        </S.CloseButton>

        <S.ContentWrapper>
          <S.Header>
            <S.Title>전체 할인</S.Title>
          </S.Header>

          <S.OptionsList>
            {DISCOUNT_OPTIONS.map((option) => (
              <div key={option.value}>
                <RadioButton
                  id={`discount-${option.value}`}
                  value={option.value}
                  checked={selectedDiscount === option.value}
                  onChange={handleDiscountChange}
                >
                  <S.OptionLabel>{option.label}</S.OptionLabel>
                </RadioButton>
                {isCustomSelected && option.value === 'custom' && (
                  <S.InputWrapper>
                    <Input
                      value={customDiscount}
                      onChange={setCustomDiscount}
                      placeholder=""
                      type="number"
                      rightComponent={<S.PercentSymbol>%</S.PercentSymbol>}
                    />
                  </S.InputWrapper>
                )}
              </div>
            ))}
          </S.OptionsList>

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
