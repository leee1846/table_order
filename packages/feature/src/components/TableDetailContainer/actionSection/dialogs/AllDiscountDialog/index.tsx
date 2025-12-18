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
import { usePostCustomAmount } from '@repo/api/queries';
import { toast } from '@repo/feature/utils';
import type { TCustomAmountType } from '@repo/api/types';

const { colors } = theme;

export type AllDiscountDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  orderGroupUuid: string;
  onApplySuccess?: () => void;
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
  orderGroupUuid,
  onApplySuccess,
}: AllDiscountDialogProps) => {
  const [selectedDiscount, setSelectedDiscount] = useState<string>('5');
  const [customDiscount, setCustomDiscount] = useState<string>('');
  const { mutateAsync: postCustomAmount, isPending: isCustomAmountPending } =
    usePostCustomAmount();

  const handleDiscountChange = (value: string) => {
    setSelectedDiscount(value);
    if (value !== 'custom') {
      setCustomDiscount('');
    }
  };

  const handleApply = async () => {
    if (isCustomAmountPending) {
      return;
    }

    const rawDiscount =
      selectedDiscount === 'custom' ? customDiscount : selectedDiscount;
    const parsedDiscount = Number(rawDiscount);

    if (!parsedDiscount) {
      toast('할인율을 입력해주세요.');
      return;
    }

    if (!Number.isInteger(parsedDiscount)) {
      toast('할인율은 정수로 입력해주세요.');
      return;
    }

    if (parsedDiscount < 0 || parsedDiscount > 100) {
      toast('할인율은 0%에서 100% 사이여야 해요.');
      return;
    }

    if (!orderGroupUuid) {
      toast('주문 정보를 찾을 수 없어요. 다시 시도해주세요.');
      return;
    }

    const type: TCustomAmountType = 'GROUP_DISCOUNT';

    try {
      await postCustomAmount({ orderGroupUuid, amount: parsedDiscount, type });
      toast('전체 할인을 적용했어요.');
      onApplySuccess?.();
      handleClose();
    } catch (error) {
      toast('전체 할인 적용 중 오류가 발생했어요. 다시 시도해주세요.');
    }
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
