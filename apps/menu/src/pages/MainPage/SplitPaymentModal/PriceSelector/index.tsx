import { css } from '@emotion/react';
import { CheckButton, NumberInput } from '@repo/ui/components';
import * as S from '@/pages/MainPage/SplitPaymentModal/PriceSelector/priceSelector.style';
import { useState } from 'react';
import { PriceChangeKeypad } from '@/pages/MainPage/SplitPaymentModal/PriceSelector/PriceChangeKeypad';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { formatCurrency } from '@repo/util/string';
import type { Person } from '@/pages/MainPage/SplitPaymentModal';

interface Props {
  totalPrice: number;
  persons: Person[];
  setPersons: (persons: Person[] | ((prev: Person[]) => Person[])) => void;
  hasAnyPayment: boolean;
}

export const PriceSelector = ({
  totalPrice,
  persons,
  setPersons,
  hasAnyPayment,
}: Props) => {
  const { t } = useCustomerTranslation();

  const [editingPersonIndex, setEditingPersonIndex] = useState<number | null>(
    null
  );

  const calculatePersonPrice = (person: Person): number => {
    if (person.customPrice !== undefined) {
      return person.customPrice;
    }

    const personsWithoutCustomPrice = persons.filter(
      (p) => p.customPrice === undefined
    );
    const countToSplit = personsWithoutCustomPrice.length;

    if (countToSplit === 0) {
      return 0;
    }

    const totalCustomAmount = persons.reduce(
      (sum, p) => sum + (p.customPrice ?? 0),
      0
    );
    const amountToSplit = Math.max(totalPrice - totalCustomAmount, 0);

    if (amountToSplit <= 0) {
      return 0;
    }

    const baseAmount = Math.floor(amountToSplit / countToSplit);
    const remainderAmount = amountToSplit - baseAmount * (countToSplit - 1);

    const personIndex = personsWithoutCustomPrice.findIndex(
      (p) => p.id === person.id
    );

    return personIndex === 0 ? remainderAmount : baseAmount;
  };

  const handlePersonSelectionToggle = (personIndex: number) => {
    const targetPerson = persons[personIndex];
    if (!targetPerson) {
      return;
    }

    setPersons((prev) =>
      prev.map((person) =>
        person.id === targetPerson.id
          ? { ...person, isSelected: !person.isSelected }
          : person
      )
    );
  };

  const handlePersonCountChange = (nextCount: number) => {
    setPersons((prev) => {
      const currentCount = prev.length;

      if (nextCount > currentCount) {
        const maxId = prev.reduce((max, p) => {
          const num = parseInt(p.id.replace('person-', ''), 10);
          return Math.max(max, num);
        }, -1);

        const newPersons = Array.from(
          { length: nextCount - currentCount },
          (_, i) => ({
            id: `person-${maxId + 1 + i}`,
            isSelected: false,
          })
        );

        return [...prev, ...newPersons];
      } else {
        return prev.slice(0, nextCount);
      }
    });
  };

  const handleCustomPriceApply = (newPrice: number) => {
    if (editingPersonIndex === null) {
      return;
    }

    const targetPerson = persons[editingPersonIndex];
    if (!targetPerson) {
      return;
    }

    setPersons((prev) =>
      prev.map((person) =>
        person.id === targetPerson.id
          ? { ...person, customPrice: newPrice }
          : person
      )
    );

    setEditingPersonIndex(null);
  };

  return (
    <>
      <S.PersonCountContainer>
        <p>{t('인원수')}</p>
        <NumberInput
          variant="square"
          size="M"
          value={persons.length}
          onChange={handlePersonCountChange}
          min={1}
          disabled={hasAnyPayment}
        />
      </S.PersonCountContainer>

      <S.MenuList>
        {persons.map((person, index) => {
          const personPrice = calculatePersonPrice(person);

          return (
            <S.MenuItem key={person.id} isSelected={person.isSelected}>
              <button type="button">
                <CheckButton
                  checked={person.isSelected}
                  onChange={() => handlePersonSelectionToggle(index)}
                  customStyle={css`
                    & > div {
                      width: 28px;
                      height: 28px;
                    }
                  `}
                >
                  <S.Price>
                    {t('{{amount}}원', {
                      amount: formatCurrency(personPrice),
                    })}
                  </S.Price>
                </CheckButton>

                {!hasAnyPayment && (
                  <S.ChangePriceButton
                    onClick={() => setEditingPersonIndex(index)}
                  >
                    {t('금액변경')}
                  </S.ChangePriceButton>
                )}
              </button>
            </S.MenuItem>
          );
        })}
      </S.MenuList>

      {editingPersonIndex !== null && persons[editingPersonIndex] && (
        <PriceChangeKeypad
          totalPrice={totalPrice}
          onApply={handleCustomPriceApply}
          onClose={() => setEditingPersonIndex(null)}
        />
      )}
    </>
  );
};
