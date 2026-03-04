import { useState } from 'react';
import { BasicButton, ModalBackground, Keypad } from '@repo/ui/components';
import { CloseIcon, ArrowBackIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from './amountChangeDialog.styles';
import { formatCurrency } from '@repo/util/string';
import { usePostCustomAmount } from '@repo/api/queries';
import { toast } from '@repo/feature/utils';
import type { TCustomAmountType } from '@repo/api/types';
import type { i18n as I18nInstance } from 'i18next';
import { useTranslation } from 'react-i18next';

const { colors } = theme;

export type AmountChangeDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  orderGroupUuid: string | undefined;
  onApplySuccess?: () => void;
  i18nInstance?: I18nInstance;
};

export const AmountChangeDialog = ({
  isOpen,
  onClose,
  orderGroupUuid,
  onApplySuccess,
  i18nInstance,
}: AmountChangeDialogProps) => {
  const { t } = useTranslation('admin', { i18n: i18nInstance });
  const [amount, setAmount] = useState<string>('0');
  const [isNegative, setIsNegative] = useState(false);
  const { mutateAsync: postCustomAmount, isPending: isCustomAmountPending } =
    usePostCustomAmount();

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

  const handleApply = async () => {
    if (isCustomAmountPending) {
      return;
    }

    const numericAmount = parseInt(amount, 10) || 0;
    const finalAmount = isNegative ? -numericAmount : numericAmount;

    if (finalAmount === 0) {
      toast(t('변경할 금액을 입력해주세요.'));
      return;
    }

    if (!orderGroupUuid) {
      toast(t('주문 정보를 찾을 수 없어요. 다시 시도해주세요.'));
      return;
    }

    const type: TCustomAmountType = 'AMOUNT_CHANGE';

    try {
      await postCustomAmount({ orderGroupUuid, amount: finalAmount, type });
      toast(t('금액을 변경했어요.'));
      onApplySuccess?.();
      handleClose();
    } catch {
      toast(t('금액 변경 중 오류가 발생했어요. 다시 시도해주세요.'));
    }
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
        <S.CloseButton onClick={handleClose} aria-label={t('닫기')}>
          <CloseIcon width={32} height={32} color={colors.grey[700]} />
        </S.CloseButton>

        <S.ContentWrapper>
          <S.Header>
            <S.Title>{t('금액 변경')}</S.Title>
          </S.Header>

          <S.AmountDisplay $isPlaceholder={amount === '0'}>
            {amount === '0'
              ? '+/-0'
              : t('{{price}}원', { price: formatCurrency(finalAmount) })}
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
              {t('적용하기')}
            </BasicButton>
          </S.Footer>
        </S.ContentWrapper>
      </S.DialogContainer>
    </ModalBackground>
  );
};
