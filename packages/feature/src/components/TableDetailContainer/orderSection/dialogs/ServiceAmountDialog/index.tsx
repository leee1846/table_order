import { useState } from 'react';
import { BasicButton, ModalBackground, Keypad } from '@repo/ui/components';
import { CloseIcon, ArrowBackIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from './serviceAmountDialog.styles';
import { formatCurrency } from '@repo/util/string';
import { usePostCustomAmount } from '@repo/api/queries';
import { toast } from '@repo/feature/utils';
import type { i18n as I18nInstance } from 'i18next';
import { useTranslation } from 'react-i18next';

const { colors } = theme;

export type ServiceAmountDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  orderGroupUuid: string;
  orderDetailMenuSeq: number;
  onApplySuccess?: () => void;
  i18nInstance?: I18nInstance;
};

export const ServiceAmountDialog = ({
  isOpen,
  onClose,
  orderGroupUuid,
  orderDetailMenuSeq,
  onApplySuccess,
  i18nInstance,
}: ServiceAmountDialogProps) => {
  const { t } = useTranslation('admin', { i18n: i18nInstance });
  const [amount, setAmount] = useState<string>('0');
  const { mutateAsync: postCustomAmount, isPending: isCustomAmountPending } =
    usePostCustomAmount();

  const handleNumberPress = (number: number) => {
    if (amount === '0') {
      setAmount(number.toString());
    } else {
      setAmount((prev) => `${prev}${number.toString()}`);
    }
  };

  const handleDoubleZero = () => {
    if (amount === '0') {
      setAmount('0');
    } else {
      setAmount((prev) => `${prev}00`);
    }
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

    if (!orderGroupUuid) {
      toast(t('주문 정보를 찾을 수 없어요. 다시 시도해주세요.'));
      return;
    }

    if (!orderDetailMenuSeq || isNaN(orderDetailMenuSeq)) {
      toast(t('메뉴 정보가 올바르지 않아요. 다시 시도해주세요.'));
      return;
    }

    const numericAmount = parseInt(amount, 10) || 0;

    if (numericAmount === 0) {
      toast(t('서비스 금액을 입력해주세요.'));
      return;
    }

    // 메뉴 서비스의 경우 amount는 음수로 요청해야 함
    const serviceAmount = numericAmount <= 0 ? numericAmount : -numericAmount;

    await postCustomAmount({
      orderGroupUuid,
      amount: serviceAmount,
      type: 'MENU_SERVICE',
      orderDetailMenuSeq,
    });

    toast(t('서비스 금액을 적용했어요.'));
    onApplySuccess?.();
    handleClose();
  };

  const handleClose = () => {
    setAmount('0');
    onClose();
  };

  const numericAmount = parseInt(amount, 10) || 0;

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
            <S.Title>{t('서비스 금액 입력')}</S.Title>
          </S.Header>

          <S.AmountDisplay $isPlaceholder={amount === '0'}>
            ₩{formatCurrency(numericAmount)}
          </S.AmountDisplay>

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
