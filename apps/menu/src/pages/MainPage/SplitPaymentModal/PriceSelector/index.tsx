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
  paidPersonIds: Set<string>;
  hasAnyPayment: boolean;
}

// 최소 인원 수
const MIN_PERSON_COUNT = 2;
// 최소 분배 가능 금액 (1인당)
const MIN_AMOUNT_PER_PERSON = 10;

export const PriceSelector = ({
  totalPrice,
  persons,
  setPersons,
  paidPersonIds,
  hasAnyPayment: _hasAnyPayment,
}: Props) => {
  const { t } = useCustomerTranslation();

  const [editingPersonIndex, setEditingPersonIndex] = useState<number | null>(
    null
  );

  /**
   * 개별 인원의 금액 계산
   * 1. 커스텀 금액이 설정된 경우: 해당 금액 반환
   * 2. 커스텀 금액이 없는 경우: 남은 금액을 균등 분배
   *    - 첫 번째 인원에게 나머지 금액 할당 (원 단위 정확도 유지)
   */
  const calculatePersonPrice = (person: Person): number => {
    // 커스텀 금액이 설정된 경우 그대로 반환
    if (person.customPrice !== undefined) {
      return person.customPrice;
    }

    // 커스텀 금액이 없는 인원들만 필터링
    const personsWithoutCustomPrice = persons.filter(
      (p) => p.customPrice === undefined
    );
    const countToSplit = personsWithoutCustomPrice.length;

    // 균등 분배 대상이 없으면 0원
    if (countToSplit === 0) {
      return 0;
    }

    // 커스텀 금액 총합 계산
    const totalCustomAmount = persons.reduce(
      (sum, p) => sum + (p.customPrice ?? 0),
      0
    );
    // 균등 분배할 금액 = 전체 금액 - 커스텀 금액 총합
    const amountToSplit = Math.max(totalPrice - totalCustomAmount, 0);

    // 분배할 금액이 없으면 0원
    if (amountToSplit <= 0) {
      return 0;
    }

    // 기본 금액 = 분배할 금액 / 인원 수 (내림)
    const baseAmount = Math.floor(amountToSplit / countToSplit);
    // 나머지 금액 = 분배할 금액 - (기본 금액 × (인원 수 - 1))
    const remainderAmount = amountToSplit - baseAmount * (countToSplit - 1);

    // 현재 인원이 균등 분배 대상 중 몇 번째인지 확인
    const personIndex = personsWithoutCustomPrice.findIndex(
      (p) => p.id === person.id
    );

    // 첫 번째 인원에게 나머지 금액 할당, 나머지는 기본 금액
    return personIndex === 0 ? remainderAmount : baseAmount;
  };

  /**
   * 인원 선택/해제 토글 핸들러
   * 체크박스 클릭 시 해당 인원의 isSelected 상태를 반전
   */
  const handlePersonSelectionToggle = (personIndex: number) => {
    const targetPerson = persons[personIndex];
    if (!targetPerson) {
      return;
    }

    setPersons((prevPersons) =>
      prevPersons.map((person) =>
        person.id === targetPerson.id
          ? { ...person, isSelected: !person.isSelected }
          : person
      )
    );
  };

  /**
   * 인원 수 변경 핸들러
   * 인원 수 증가/감소 시 다음 규칙 적용:
   * 1. 인원 증가: 1인당 최소 10원 이상 분배 가능한지 검증
   * 2. 결제 완료된 인원은 유지, 미결제 인원만 조정
   * 3. 미결제 인원의 커스텀 금액 초기화 (N/1 균등 분배)
   */
  const handlePersonCountChange = (nextCount: number) => {
    setPersons((prevPersons) => {
      // 결제 완료/미완료 인원 분리
      const paidPersons = prevPersons.filter((p) => paidPersonIds.has(p.id));
      const unpaidPersons = prevPersons.filter((p) => !paidPersonIds.has(p.id));
      const currentUnpaidCount = unpaidPersons.length;

      // 인원 수 증가 처리
      if (nextCount > currentUnpaidCount) {
        // 1인당 분배 가능한 금액 계산 (전체 금액 / 변경할 인원 수)
        const amountPerPerson = Math.floor(totalPrice / nextCount);
        
        // 최소 금액(10원) 미만이면 인원 증가 불가
        if (amountPerPerson < MIN_AMOUNT_PER_PERSON) {
          return prevPersons;
        }

        // 기존 인원 중 최대 ID 값 찾기
        const maxExistingId = prevPersons.reduce((maxId, person) => {
          const personNumber = parseInt(person.id.replace('person-', ''), 10);
          return Math.max(maxId, personNumber);
        }, -1);

        // 새로운 인원 생성 (증가된 수만큼)
        const newPersons = Array.from(
          { length: nextCount - currentUnpaidCount },
          (_, index) => ({
            id: `person-${maxExistingId + 1 + index}`,
            isSelected: false,
          })
        );

        // 미결제 인원들의 커스텀 금액 초기화 (균등 분배를 위해)
        const resetUnpaidPersons = unpaidPersons.map((person) => ({
          ...person,
          customPrice: undefined,
          isSelected: false,
        }));

        // 결제 완료 인원 + 초기화된 미결제 인원 + 새 인원
        return [...paidPersons, ...resetUnpaidPersons, ...newPersons];
      }

      // 인원 수 감소 처리
      // 미결제 인원만 변경된 수만큼 유지하고 나머지 제거
      const adjustedUnpaidPersons = unpaidPersons
        .slice(0, nextCount)
        .map((person) => ({
          ...person,
          customPrice: undefined,
          isSelected: false,
        }));

      // 결제 완료 인원 + 조정된 미결제 인원
      return [...paidPersons, ...adjustedUnpaidPersons];
    });
  };

  /**
   * 커스텀 금액 적용 핸들러
   * 선택된 인원의 금액을 변경하고, 나머지 미결제 인원은 균등 분배
   * 1. 대상 인원: 입력된 커스텀 금액 설정
   * 2. 나머지 미결제 인원: 커스텀 금액 초기화 (남은 금액을 N/1 분배)
   */
  const handleCustomPriceApply = (customPrice: number) => {
    if (editingPersonIndex === null) {
      return;
    }

    const targetPerson = persons[editingPersonIndex];
    if (!targetPerson) {
      return;
    }

    setPersons((prevPersons) => {
      // 결제 완료/미완료 인원 분리
      const paidPersons = prevPersons.filter((p) => paidPersonIds.has(p.id));
      const unpaidPersons = prevPersons.filter((p) => !paidPersonIds.has(p.id));

      // 미결제 인원 중 금액 설정
      const updatedUnpaidPersons = unpaidPersons.map((person) => {
        if (person.id === targetPerson.id) {
          // 대상 인원: 커스텀 금액 적용
          return { ...person, customPrice };
        }
        // 나머지 인원: 커스텀 금액 초기화 (균등 분배를 위해)
        return { ...person, customPrice: undefined, isSelected: false };
      });

      // 결제 완료 인원 + 업데이트된 미결제 인원
      return [...paidPersons, ...updatedUnpaidPersons];
    });

    setEditingPersonIndex(null);
  };

  // 최대 인원 수 계산: 남은 금액을 최소 금액(10원)씩 분배 가능한 최대 인원
  const maxPersonCount = Math.max(
    Math.floor(totalPrice / MIN_AMOUNT_PER_PERSON),
    MIN_PERSON_COUNT
  );

  return (
    <>
      {/* 인원 수 입력 영역 */}
      <S.PersonCountContainer>
        <p>{t('인원수')}</p>
        <NumberInput
          variant="square"
          size="M"
          value={persons.length}
          onChange={handlePersonCountChange}
          min={MIN_PERSON_COUNT}
          max={maxPersonCount}
        />
      </S.PersonCountContainer>

      {/* 인원별 금액 목록 */}
      <S.MenuList>
        {persons.map((person, index) => {
          const personPrice = calculatePersonPrice(person);
          const canChangePrice = personPrice > MIN_AMOUNT_PER_PERSON;

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

                {/* 10원 초과 시에만 금액 변경 버튼 표시 */}
                {canChangePrice && (
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

      {/* 금액 변경 키패드 모달 */}
      {editingPersonIndex !== null && persons[editingPersonIndex] && (
        <PriceChangeKeypad
          totalPrice={totalPrice}
          remainingPersonCount={persons.length}
          onApply={handleCustomPriceApply}
          onClose={() => setEditingPersonIndex(null)}
        />
      )}
    </>
  );
};
