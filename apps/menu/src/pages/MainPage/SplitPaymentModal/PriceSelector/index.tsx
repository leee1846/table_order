import { css } from '@emotion/react';
import { CheckButton, NumberInput } from '@repo/ui/components';
import * as S from '@/pages/MainPage/SplitPaymentModal/PriceSelector/priceSelector.style';
import { useState } from 'react';
import { PriceChangeKeypad } from '@/pages/MainPage/SplitPaymentModal/PriceSelector/PriceChangeKeypad';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { formatCurrency } from '@repo/util/string';

interface Props {
  totalPrice: number;
}

interface Person {
  id: string;
  isSelected: boolean;
  customPrice?: number;
}

export const PriceSelector = ({ totalPrice }: Props) => {
  const { t } = useCustomerTranslation();

  /** 사람 리스트 (id, 선택 여부, 커스텀 금액 포함) */
  const [prices, setPrices] = useState<Person[]>(() =>
    Array.from({ length: 2 }, (_, index) => ({
      id: `person-${index}`,
      isSelected: false,
    }))
  );

  /** 현재 금액 변경 중인 사람 인덱스 */
  const [editingPriceIndex, setEditingPriceIndex] = useState<number | null>(
    null
  );

  /**
   * 각 사람의 금액 계산
   */
  const getPersonPrice = (person: Person): number => {
    // 커스텀 가격이 있으면 그대로 반환
    if (person.customPrice !== undefined) {
      return person.customPrice;
    }

    // 커스텀 가격이 없는 사람들만 필터링
    const personsWithoutCustom = prices.filter(
      (p) => p.customPrice === undefined
    );
    const count = personsWithoutCustom.length;

    if (count === 0) {
      return 0;
    }

    // 커스텀 가격 합계 계산
    const totalCustom = prices.reduce(
      (sum, p) => sum + (p.customPrice ?? 0),
      0
    );
    const remain = Math.max(totalPrice - totalCustom, 0);

    if (remain <= 0) {
      return 0;
    }

    // 균등 분배 (첫 번째 사람에게 나머지 할당)
    const baseShare = Math.floor(remain / count);
    const remainder = remain - baseShare * (count - 1);

    const indexInRemaining = personsWithoutCustom.findIndex(
      (p) => p.id === person.id
    );
    return indexInRemaining === 0 ? remainder : baseShare;
  };

  /**
   * 선택 토글
   */
  const togglePersonSelection = (personIndex: number) => {
    setPrices((prev) =>
      prev.map((price, index) =>
        index === personIndex
          ? { ...price, isSelected: !price.isSelected }
          : price
      )
    );
  };

  /**
   * 인원수 변경
   */
  const handleChangePersonCount = (nextCount: number) => {
    setPrices((prev) => {
      const currentCount = prev.length;

      if (nextCount > currentCount) {
        // 인원 증가: 기존 사람 유지하고 새로 추가
        const newPrices = Array.from(
          { length: nextCount - currentCount },
          (_, i) => ({
            id: `person-${currentCount + i}`,
            isSelected: false,
          })
        );
        return [...prev, ...newPrices];
      } else {
        // 인원 감소: 앞에서부터 제거
        return prev.slice(0, nextCount);
      }
    });
  };

  /**
   * 키패드 열기/닫기
   */
  const openPriceKeypad = (priceIndex: number) =>
    setEditingPriceIndex(priceIndex);
  const closePriceKeypad = () => setEditingPriceIndex(null);

  /**
   * 커스텀 금액 적용
   */
  const applyCustomPrice = (newPrice: number) => {
    if (editingPriceIndex === null) {
      return;
    }

    setPrices((prev) =>
      prev.map((price, index) =>
        index === editingPriceIndex
          ? { ...price, customPrice: newPrice }
          : price
      )
    );

    closePriceKeypad();
  };

  return (
    <>
      <S.PersonCountContainer>
        <p>{t('인원수')}</p>
        <NumberInput
          variant="square"
          size="M"
          value={prices.length}
          onChange={handleChangePersonCount}
          min={1}
        />
      </S.PersonCountContainer>

      <S.MenuList>
        {prices.map((price, index) => {
          const priceValue = getPersonPrice(price);

          return (
            <S.MenuItem key={price.id} isSelected={price.isSelected}>
              <button type="button">
                <CheckButton
                  checked={price.isSelected}
                  onChange={() => togglePersonSelection(index)}
                  customStyle={css`
                    & > div {
                      width: 28px;
                      height: 28px;
                    }
                  `}
                >
                  <S.Price>
                    {t('{{amount}}원', {
                      amount: formatCurrency(priceValue),
                    })}
                  </S.Price>
                </CheckButton>

                <S.ChangePriceButton onClick={() => openPriceKeypad(index)}>
                  {t('금액변경')}
                </S.ChangePriceButton>
              </button>
            </S.MenuItem>
          );
        })}
      </S.MenuList>

      {editingPriceIndex !== null && prices[editingPriceIndex] && (
        <PriceChangeKeypad
          totalPrice={totalPrice}
          onApply={applyCustomPrice}
          onClose={closePriceKeypad}
        />
      )}
    </>
  );
};
