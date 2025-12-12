import { BasicButton, Keypad, ModalBackground } from '@repo/ui/components';
import { ArrowBackIcon, CloseIcon } from '@repo/ui/icons';
import { useThemeMode } from '@repo/ui';
import * as S from '@/pages/MainPage/SplitPaymentModal/PriceSelector/PriceChangeKeypad/priceChangeKeypad.style';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { useState } from 'react';
import { formatCurrency } from '@repo/util/string';

interface Props {
  totalPrice: number;
  onApply: (price: number) => void;
  onClose: () => void;
}

const MIN_PRICE = 100;
const MAX_PRICE = 70000000;

export const PriceChangeKeypad = ({ totalPrice, onApply, onClose }: Props) => {
  const { theme } = useThemeMode();
  const { t } = useCustomerTranslation();

  const [temporaryPrice, setTemporaryPrice] = useState<number>(0);

  const handleNumberPress = (number: number) => {
    const newPrice = temporaryPrice * 10 + number;
    if (newPrice <= MAX_PRICE) {
      setTemporaryPrice(newPrice);
    }
  };

  const handleDoubleZero = () => {
    const newPrice = temporaryPrice * 100;
    if (newPrice <= MAX_PRICE) {
      setTemporaryPrice(newPrice);
    }
  };

  const handleBackspace = () => {
    setTemporaryPrice((prev) => Math.floor(prev / 10));
  };

  /**
   * 가격 유효성 검증
   */
  const isValidPrice =
    temporaryPrice > 0 &&
    temporaryPrice >= MIN_PRICE &&
    temporaryPrice <= MAX_PRICE &&
    temporaryPrice <= totalPrice;

  const handleApply = () => {
    if (isValidPrice) {
      onApply(temporaryPrice);
    }
  };

  return (
    <ModalBackground onClick={onClose}>
      <S.Container>
        <S.CloseButton type="button" onClick={onClose}>
          <CloseIcon width={32} height={32} color={theme.mode.grey[700]} />
        </S.CloseButton>

        <S.Title>{t('금액 변경하기')}</S.Title>

        <S.Price>
          {t('{{amount}}원', {
            amount: formatCurrency(temporaryPrice),
          })}
        </S.Price>

        <div>
          <Keypad
            bottomLeftLabel="00"
            bottomLeftAction={handleDoubleZero}
            bottomRightIcon={
              <ArrowBackIcon
                width={28}
                height={28}
                color={theme.mode.grey[700]}
              />
            }
            bottomRightAction={handleBackspace}
            onNumberPress={handleNumberPress}
          />
        </div>

        <S.BottomContainer>
          <div>
            <span />
            <p>
              {t('{{minAmount}}원-{{maxAmount}}원 까지 적용할 수 있어요.', {
                minAmount: formatCurrency(MIN_PRICE),
                maxAmount: formatCurrency(MAX_PRICE),
              })}
            </p>
          </div>
          <BasicButton
            variant="Solid_Blue_2XL"
            onClick={handleApply}
            disabled={!isValidPrice}
          >
            {t('적용하기')}
          </BasicButton>
        </S.BottomContainer>
      </S.Container>
    </ModalBackground>
  );
};
