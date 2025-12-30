import { BasicButton, ModalBackground } from '@repo/ui/components';
import * as S from '@/pages/MainPage/SplitPaymentModal/splitPaymentModal.style';
import { useState, useMemo, useCallback } from 'react';
import { MenuSelector } from '@/pages/MainPage/SplitPaymentModal/MenuSelector';
import { PriceSelector } from '@/pages/MainPage/SplitPaymentModal/PriceSelector';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { CloseIcon } from '@repo/ui/icons';
import { useThemeMode } from '@repo/ui';
import { useCartStore } from '@/stores/useCartStore';
import type { ICartMenuWithId, ICartMenu } from '@/types/cart';
import { formatCurrency } from '@repo/util/string';
import { useDeviceData } from '@/hooks/useDeviceData';
import { calculateMenuTotalPrice } from '@/utils/calculation';
import { toast } from '@repo/feature/utils';
import { useModalStore } from '@/stores/useModalStore';
import { CardPaymentProgressModal } from '@/pages/MainPage/CardPaymentProgressModal';

interface Props {
  onClose: () => void;
}

export interface Person {
  id: string;
  isSelected: boolean;
  customPrice?: number; // 사용자가 직접 설정한 금액
  paidAmount?: number; // 결제 완료된 금액 (합계 계산용)
}

const calculateSingleMenuPrice = (menu: ICartMenu): number => {
  const options = menu.selectedOptions.map((option) => ({
    optionPrice: option.optionPrice,
    quantity: option.quantity,
  }));

  return calculateMenuTotalPrice(menu.menuPrice, menu.quantity, options);
};

const calculateTotalMenusPrice = (menus: ICartMenu[]): number => {
  return menus.reduce(
    (total, menu) => total + calculateSingleMenuPrice(menu),
    0
  );
};

const calculatePersonPrice = (
  person: Person,
  allPersons: Person[],
  remainingTotal: number
): number => {
  // 커스텀 금액이 설정된 경우 그대로 반환
  if (person.customPrice !== undefined) {
    return person.customPrice;
  }

  // 커스텀 금액이 없는 사람들만 균등 분배 대상
  const personsWithoutCustomPrice = allPersons.filter(
    (p) => p.customPrice === undefined
  );
  const countToSplit = personsWithoutCustomPrice.length;

  if (countToSplit === 0) {
    return 0;
  }

  // 커스텀 금액 합계 계산
  const totalCustomAmount = allPersons.reduce(
    (sum, p) => sum + (p.customPrice ?? 0),
    0
  );
  const amountToSplit = Math.max(remainingTotal - totalCustomAmount, 0);

  if (amountToSplit <= 0) {
    return 0;
  }

  // 균등 분배 (첫 번째 사람에게 나머지 할당하여 정확한 금액 맞춤)
  const baseAmount = Math.floor(amountToSplit / countToSplit);
  const remainderAmount = amountToSplit - baseAmount * (countToSplit - 1);

  const personIndex = personsWithoutCustomPrice.findIndex(
    (p) => p.id === person.id
  );

  return personIndex === 0 ? remainderAmount : baseAmount;
};

export const SplitPaymentModal = ({ onClose }: Props) => {
  const { t } = useCustomerTranslation();
  const { theme } = useThemeMode();

  const { data: deviceData } = useDeviceData();
  const { data: cartData, clearCart } = useCartStore();
  const { data: modalData, setModalData, closeAllModals } = useModalStore();

  // 결제 방식 상태
  const [isPaymentByMenu, setIsPaymentByMenu] = useState(true);

  // 메뉴별 나누기 상태
  const [menuSplit_selectedMenus, setMenuSplit_selectedMenus] = useState<
    ICartMenuWithId[]
  >([]);
  const [menuSplit_paidMenuIds, setMenuSplit_paidMenuIds] = useState<
    Set<string>
  >(new Set());

  // 인원수로 나누기 상태
  const [personSplit_persons, setPersonSplit_persons] = useState<Person[]>(() =>
    Array.from({ length: 2 }, (_, index) => ({
      id: `person-${index}`,
      isSelected: false,
    }))
  );
  const [personSplit_paidPersonIds, setPersonSplit_paidPersonIds] = useState<
    Set<string>
  >(new Set());

  // 전체 메뉴 목록 (quantity만큼 개별 항목으로 펼침)
  const allMenus = useMemo(
    () =>
      cartData.menus.flatMap((menu, menuIndex) =>
        Array.from({ length: menu.quantity }, (_, quantityIndex) => ({
          ...menu,
          quantity: 1,
          id: `${menu.menuSeq}-${menuIndex}-${quantityIndex}`,
        }))
      ),
    [cartData.menus]
  );

  // 전체 결제 금액
  const totalPrice = useMemo(
    () => calculateTotalMenusPrice(cartData.menus),
    [cartData.menus]
  );

  // ----------------------------------------------------------------------------
  // "메뉴별 나누기"
  // ----------------------------------------------------------------------------

  const menuSplit_remainingMenus = useMemo(
    () => allMenus.filter((menu) => !menuSplit_paidMenuIds.has(menu.id)),
    [allMenus, menuSplit_paidMenuIds]
  );

  const menuSplit_selectedPrice = useMemo(
    () => calculateTotalMenusPrice(menuSplit_selectedMenus),
    [menuSplit_selectedMenus]
  );

  const menuSplit_remainingPrice = useMemo(
    () => calculateTotalMenusPrice(menuSplit_remainingMenus),
    [menuSplit_remainingMenus]
  );

  // ----------------------------------------------------------------------------
  // "인원수로 나누기"
  // ----------------------------------------------------------------------------

  const personSplit_remainingPersons = useMemo(
    () =>
      personSplit_persons.filter(
        (person) => !personSplit_paidPersonIds.has(person.id)
      ),
    [personSplit_persons, personSplit_paidPersonIds]
  );

  const personSplit_paidAmount = useMemo(() => {
    return personSplit_persons
      .filter((person) => personSplit_paidPersonIds.has(person.id))
      .reduce((sum, person) => sum + (person.paidAmount ?? 0), 0);
  }, [personSplit_persons, personSplit_paidPersonIds]);

  const personSplit_remainingTotal = useMemo(
    () => totalPrice - personSplit_paidAmount,
    [totalPrice, personSplit_paidAmount]
  );

  const personSplit_getPersonPrice = useCallback(
    (person: Person, allPersons: Person[]): number => {
      return calculatePersonPrice(
        person,
        allPersons,
        personSplit_remainingTotal
      );
    },
    [personSplit_remainingTotal]
  );

  const personSplit_selectedPrice = useMemo(() => {
    return personSplit_remainingPersons
      .filter((person) => person.isSelected)
      .reduce((sum, person) => {
        return (
          sum + personSplit_getPersonPrice(person, personSplit_remainingPersons)
        );
      }, 0);
  }, [personSplit_remainingPersons, personSplit_getPersonPrice]);

  // ----------------------------------------------------------------------------
  // UI에서 사용
  // ----------------------------------------------------------------------------

  const currentSelectedPrice = isPaymentByMenu
    ? menuSplit_selectedPrice
    : personSplit_selectedPrice;

  const currentRemainingPrice = isPaymentByMenu
    ? menuSplit_remainingPrice
    : personSplit_remainingTotal;

  // ----------------------------------------------------------------------------
  // Event Handlers
  // ----------------------------------------------------------------------------

  const handlePaymentMethodChange = (changeToMenuMode: boolean) => {
    if (isPaymentByMenu === changeToMenuMode) {
      return;
    }

    setIsPaymentByMenu(changeToMenuMode);

    // 선택 상태 초기화
    setMenuSplit_selectedMenus([]);
    setPersonSplit_persons((prev) =>
      prev.map((person) => ({ ...person, isSelected: false }))
    );
  };

  const handlePaymentComplete = (isAllPaid: boolean) => {
    if (isAllPaid) {
      clearCart();
      closeAllModals();
      toast(t('결제가 완료되었습니다.'), {
        position: 'center-center',
        duration: 1500,
      });
      // TODO: 주문내역 api를 호출 해야하는가?? 확인 필요.
    }
  };

  const handleMenuSplitPayment = () => {
    if (menuSplit_selectedMenus.length === 0) {
      toast(t('선택된 메뉴가 없습니다.'), {
        position: 'center-center',
        duration: 1500,
      });
      return;
    }

    const selectedIds = menuSplit_selectedMenus.map((menu) => menu.id);
    const isAllPaid =
      menuSplit_remainingMenus.length === menuSplit_selectedMenus.length;

    // 카드 결제 진행 모달 열기
    setModalData('isCardPaymentProgressModalOpened', true);

    // TODO: 카드 결제 API 호출 (추후 구현)
    setTimeout(() => {
      setModalData('isCardPaymentProgressModalOpened', false);

      // 결제 완료 처리
      setMenuSplit_paidMenuIds((prev) => new Set([...prev, ...selectedIds]));
      setMenuSplit_selectedMenus([]);

      handlePaymentComplete(isAllPaid);
    }, 2000);
  };

  const handlePersonSplitPayment = () => {
    const selectedPersons = personSplit_remainingPersons.filter(
      (person) => person.isSelected
    );

    if (selectedPersons.length === 0) {
      toast(t('선택된 인원이 없습니다.'), {
        position: 'center-center',
        duration: 1500,
      });
      return;
    }

    const selectedPersonsData = selectedPersons.map((person) => ({
      id: person.id,
      price: personSplit_getPersonPrice(person, personSplit_remainingPersons),
    }));
    const isAllPaid =
      personSplit_remainingPersons.length === selectedPersons.length;

    // 카드 결제 진행 모달 열기
    setModalData('isCardPaymentProgressModalOpened', true);

    // TODO: 카드 결제 API 호출 (추후 구현)
    setTimeout(() => {
      setModalData('isCardPaymentProgressModalOpened', false);

      // 결제 완료 처리
      setPersonSplit_paidPersonIds(
        (prev) => new Set([...prev, ...selectedPersonsData.map((p) => p.id)])
      );

      // 결제 금액을 paidAmount에 저장 (이후 합계 계산용)
      setPersonSplit_persons((prev) =>
        prev.map((person) => {
          const paidPerson = selectedPersonsData.find(
            (p) => p.id === person.id
          );
          if (paidPerson) {
            return {
              ...person,
              isSelected: false,
              paidAmount: paidPerson.price,
            };
          }
          return { ...person, isSelected: false };
        })
      );

      handlePaymentComplete(isAllPaid);
    }, 2000);
  };

  const handlePayment = () => {
    if (isPaymentByMenu) {
      handleMenuSplitPayment();
    } else {
      handlePersonSplitPayment();
    }
  };

  const hasAnyPayment =
    menuSplit_paidMenuIds.size > 0 || personSplit_paidPersonIds.size > 0;

  return (
    <>
      <ModalBackground onClick={onClose}>
        <S.Container
          role="dialog"
          aria-modal="true"
          aria-labelledby="split-payment-title"
        >
          <S.CloseButton
            type="button"
            onClick={onClose}
            aria-label={t('모달 닫기')}
          >
            <CloseIcon width={32} height={32} color={theme.mode.grey[700]} />
          </S.CloseButton>

          <S.LeftContainer>
            <h2 id="split-payment-title">{t('분할 결제 방식을 선택하세요')}</h2>
            <S.ToggleButtonContainer
              role="radiogroup"
              aria-label={t('분할 결제 방식을 선택하세요')}
            >
              <S.ToggleButton
                isActive={isPaymentByMenu}
                onClick={() => handlePaymentMethodChange(true)}
                disabled={hasAnyPayment}
                role="radio"
                aria-checked={isPaymentByMenu}
                aria-label={t('메뉴별로 나누기')}
              >
                {t('메뉴별로 나누기')}
              </S.ToggleButton>
              <S.ToggleButton
                isActive={!isPaymentByMenu}
                onClick={() => handlePaymentMethodChange(false)}
                disabled={hasAnyPayment}
                role="radio"
                aria-checked={!isPaymentByMenu}
                aria-label={t('인원 수로 나누기')}
              >
                {t('인원 수로 나누기')}
              </S.ToggleButton>
            </S.ToggleButtonContainer>

            <S.SelectorContainer>
              {isPaymentByMenu && (
                <MenuSelector
                  menus={menuSplit_remainingMenus}
                  selectedMenus={menuSplit_selectedMenus}
                  setSelectedMenus={setMenuSplit_selectedMenus}
                />
              )}

              {!isPaymentByMenu && (
                <PriceSelector
                  totalPrice={personSplit_remainingTotal}
                  persons={personSplit_remainingPersons}
                  setPersons={setPersonSplit_persons}
                  hasAnyPayment={personSplit_paidPersonIds.size > 0}
                />
              )}

              <S.SelectorTotalContainer role="region" aria-live="polite">
                <S.TotalInfo>
                  <h3>{t('총 결제금액')}</h3>
                  <p>
                    {t('{{amount}}원', { amount: formatCurrency(totalPrice) })}
                  </p>
                </S.TotalInfo>
                <S.RemainingAmount>
                  <h3>{t('남은 결제 금액')}</h3>
                  <p>
                    {t('{{amount}}원', {
                      amount: formatCurrency(currentRemainingPrice),
                    })}
                  </p>
                </S.RemainingAmount>
              </S.SelectorTotalContainer>
            </S.SelectorContainer>
          </S.LeftContainer>

          <S.RightContainer>
            <h2>
              {t('테이블')}
              {deviceData?.tableNumber} {t('총 주문내역')}
            </h2>

            <S.OrderList role="list" aria-label={t('총 주문내역')}>
              {allMenus.map((menu) => (
                <li key={menu.id} role="listitem">
                  <S.MenuInfo>
                    <h3>{menu.menuName}</h3>
                    <p>{formatCurrency(menu.quantity)}</p>
                    <p>{formatCurrency(menu.menuPrice)}</p>
                  </S.MenuInfo>

                  <S.OptionList role="list">
                    {menu.selectedOptions.map((option, index) => (
                      <li
                        key={`${option.optionSeq}-${index + 1}`}
                        role="listitem"
                      >
                        <div>
                          <span />
                          <p>{option.optionName}</p>
                        </div>

                        <div>
                          <p>{formatCurrency(option.quantity)}</p>
                          <p>{formatCurrency(option.optionPrice)}</p>
                        </div>
                      </li>
                    ))}
                  </S.OptionList>
                </li>
              ))}
            </S.OrderList>

            <S.TotalContainer>
              <BasicButton
                variant="Solid_Blue_2XL"
                onClick={handlePayment}
                aria-label={t('{{amount}}원 카드 결제', {
                  amount: formatCurrency(currentSelectedPrice),
                })}
              >
                {t('{{amount}}원 카드 결제', {
                  amount: formatCurrency(currentSelectedPrice),
                })}
              </BasicButton>
            </S.TotalContainer>
          </S.RightContainer>
        </S.Container>
      </ModalBackground>

      {/* 카드 결제 진행 모달 */}
      {modalData.isCardPaymentProgressModalOpened && (
        <CardPaymentProgressModal
          onClose={() =>
            setModalData('isCardPaymentProgressModalOpened', false)
          }
        />
      )}
    </>
  );
};
