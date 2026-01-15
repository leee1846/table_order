import { BasicButton, Keypad, ModalBackground } from '@repo/ui/components';
import { ArrowBackIcon, CloseIcon } from '@repo/ui/icons';
import { useThemeMode } from '@repo/ui';
import * as S from '@/pages/MainPage/SplitPaymentModal/PriceSelector/PriceChangeKeypad/priceChangeKeypad.style';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { useState } from 'react';
import { formatCurrency } from '@repo/util/string';

interface Props {
  totalPrice: number;
  remainingPersonCount: number;
  onApply: (price: number) => void;
  onClose: () => void;
}

export const PriceChangeKeypad = ({ 
  totalPrice, 
  remainingPersonCount,
  onApply, 
  onClose 
}: Props) => {
  const { theme } = useThemeMode();
  const { t } = useCustomerTranslation();

  const [inputPrice, setInputPrice] = useState<number>(0);

  // 입력 가능한 최소 금액
  const MIN_AMOUNT = 10;

  /**
   * 입력 가능한 최대 금액 계산
   * 현재 인원을 제외한 나머지 인원들이 최소 10원 이상 받을 수 있도록 제한
   * 
   * 계산식:
   * - 나머지 인원 수 = 전체 인원 수 - 1 (현재 편집 중인 인원 제외)
   * - 나머지 인원이 받을 최소 금액 = 나머지 인원 수 × 10원
   * - 최대 입력 가능 금액 = 전체 금액 - 나머지 인원 최소 금액
   * 
   * 예: 전체 100원, 3명
   * - 나머지 인원: 2명
   * - 나머지 인원 최소 금액: 2 × 10 = 20원
   * - 최대 입력 가능: 100 - 20 = 80원
   */
  const otherPersonCount = remainingPersonCount - 1;
  const minAmountForOthers = otherPersonCount * MIN_AMOUNT;
  const maxAllowedAmount = totalPrice - minAmountForOthers;

  /**
   * 숫자 버튼 클릭 핸들러
   * 현재 금액 * 10 + 입력된 숫자
   */
  const handleNumberPress = (number: number) => {
    const newPrice = inputPrice * 10 + number;
    setInputPrice(newPrice);
  };

  /**
   * '00' 버튼 클릭 핸들러
   * 현재 금액 * 100
   */
  const handleDoubleZeroPress = () => {
    const newPrice = inputPrice * 100;
    setInputPrice(newPrice);
  };

  /**
   * 백스페이스 버튼 클릭 핸들러
   * 현재 금액을 10으로 나눈 몫 (마지막 자릿수 제거)
   */
  const handleBackspace = () => {
    setInputPrice((prevPrice) => Math.floor(prevPrice / 10));
  };

  /**
   * 가격 유효성 검증
   * - 최소 금액: 10원
   * - 최대 금액: 나머지 인원이 최소 10원 이상 받을 수 있는 금액
   */
  const isValidPrice = inputPrice >= MIN_AMOUNT && inputPrice <= maxAllowedAmount;

  /**
   * 적용 버튼 클릭 핸들러
   * 유효한 금액인 경우에만 부모 컴포넌트에 전달
   */
  const handleApplyPrice = () => {
    if (isValidPrice) {
      onApply(inputPrice);
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
            amount: formatCurrency(inputPrice),
          })}
        </S.Price>

        <div>
          <Keypad
            bottomLeftLabel="00"
            bottomLeftAction={handleDoubleZeroPress}
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
              {t('10원-{{maxAmount}}원까지 적용할 수 있어요.', {
                maxAmount: formatCurrency(maxAllowedAmount),
              })}
            </p>
          </div>
          <BasicButton
            variant="Solid_Blue_2XL"
            onClick={handleApplyPrice}
            disabled={!isValidPrice}
          >
            {t('적용하기')}
          </BasicButton>
        </S.BottomContainer>
      </S.Container>
    </ModalBackground>
  );
};
