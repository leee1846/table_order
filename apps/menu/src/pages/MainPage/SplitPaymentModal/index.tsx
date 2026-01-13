import { BasicButton, ModalBackground } from '@repo/ui/components';
import * as S from '@/pages/MainPage/SplitPaymentModal/splitPaymentModal.style';
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
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
import { toast, openConfirmDialog } from '@repo/feature/utils';
import { useModalStore } from '@/stores/useModalStore';
import { CardPaymentProgressModal } from '@/pages/MainPage/CardPaymentProgressModal';
import { SplitPaymentInstallmentModal } from './SplitPaymentInstallmentModal';
import {
  Payment,
  type IPaymentResponse,
  type IPaymentEventData,
} from '@repo/util/app';
import { usePostPaymentApproval, usePostTableOrder } from '@repo/api/queries';
import type { IOrder } from '@repo/api/types';
import { useShopData } from '@/hooks/useShopData';
import { useCustomerCountStore } from '@/stores/useCustomerCountStore';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import {
  INSTALLMENT_MINIMUM_AMOUNT,
  INSTALLMENT_LUMP_SUM,
  formatInstallmentMonthsToString,
} from '@/feature/Installment';

interface Props {
  onClose: () => void;
}

const ORDER_TYPE_PREPAYMENT = 'PREPAYMENT';
const PAYMENT_EVENT_NAME = 'paymentEvent';
const HTTP_STATUS_BAD_REQUEST = 400;
const TOAST_DURATION = 1500;
const TOAST_POSITION = 'center-center' as const;
const INITIAL_PERSON_COUNT = 2;

export interface Person {
  id: string;
  isSelected: boolean;
  customPrice?: number; // 사용자가 직접 설정한 금액
  paidAmount?: number; // 결제 완료된 금액 (합계 계산용)
}

interface PaymentResult {
  orderGroupUuid: string;
  orderUuid: string;
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

/**
 * 장바구니 데이터를 주문 데이터 형식으로 변환
 */
const convertCartMenusToOrders = (cartMenus: ICartMenu[]): IOrder[] => {
  return cartMenus.map((menu: ICartMenu) => ({
    menuSeq: menu.menuSeq,
    menuName: menu.menuName,
    menuPrice: menu.menuPrice,
    quantity: menu.quantity,
    selectedOptions: menu.selectedOptions.map((selectedOption) => ({
      optionSeq: selectedOption.optionSeq,
      optionGroupSeq: selectedOption.optionGroupSeq,
      optionName: selectedOption.optionName,
      optionPrice: selectedOption.optionPrice,
      quantity: selectedOption.quantity,
    })),
  }));
};

/**
 * 주문 옵션 수량을 주문 수량에 맞게 조정
 * (메뉴 수량 × 옵션 수량)
 */
const adjustOrderOptionQuantities = (orders: IOrder[]): IOrder[] => {
  return orders.map((order) => ({
    ...order,
    selectedOptions: order.selectedOptions.map((option) => ({
      ...option,
      quantity: order.quantity * option.quantity,
    })),
  }));
};

const isUserCancelError = (error: unknown): boolean => {
  return (
    (error as Error).message === 'USER_CANCEL' &&
    (error as unknown as { code: string }).code === 'CANCELED'
  );
};

export const SplitPaymentModal = ({ onClose }: Props) => {
  const { t } = useCustomerTranslation();
  const { theme } = useThemeMode();
  const navigate = useNavigate();

  const { data: deviceData } = useDeviceData();
  const { data: cartData, clearCart } = useCartStore();
  const { data: shopDetailData } = useShopDetailData();
  const { data: modalData, setModalData } = useModalStore();
  const { shopData } = useShopData();
  const { data: customerCountData } = useCustomerCountStore();
  const { mutateAsync: createTableOrder } = usePostTableOrder({
    ignoreGlobalErrors: [HTTP_STATUS_BAD_REQUEST],
  });
  const { mutateAsync: postPaymentApproval } = usePostPaymentApproval();

  // 결제 방식 상태
  const [isPaymentByMenu, setIsPaymentByMenu] = useState(true);

  // 메뉴별 나누기 상태
  const [selectedMenus, setSelectedMenus] = useState<ICartMenuWithId[]>([]);
  const [paidMenuIds, setPaidMenuIds] = useState<Set<string>>(new Set());

  // 주문 정보 (첫 결제 시 저장, 이후 재사용)
  const [orderGroupUuid, setOrderGroupUuid] = useState<string | null>(null);
  const [orderUuid, setOrderUuid] = useState<string | null>(null);

  // Payment 진행 상태
  const [paymentProgressMessage, setPaymentProgressMessage] =
    useState<string>('');
  const paymentListenerRef = useRef<{ remove: () => Promise<void> } | null>(
    null
  );

  // 할부 선택
  const [selectedInstallmentMonths, setSelectedInstallmentMonths] =
    useState<number>(INSTALLMENT_LUMP_SUM);

  // 할부 선택 모달 상태
  const [isInstallmentModalOpen, setIsInstallmentModalOpen] =
    useState<boolean>(false);

  // 인원수로 나누기 상태
  const [persons, setPersons] = useState<Person[]>(() =>
    Array.from({ length: INITIAL_PERSON_COUNT }, (_, index) => ({
      id: `person-${index}`,
      isSelected: false,
    }))
  );
  const [paidPersonIds, setPaidPersonIds] = useState<Set<string>>(new Set());

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
  // "메뉴별 나누기" 계산값
  // ----------------------------------------------------------------------------

  const remainingMenus = useMemo(
    () => allMenus.filter((menu) => !paidMenuIds.has(menu.id)),
    [allMenus, paidMenuIds]
  );

  const selectedMenuPrice = useMemo(
    () => calculateTotalMenusPrice(selectedMenus),
    [selectedMenus]
  );

  const remainingMenuPrice = useMemo(
    () => calculateTotalMenusPrice(remainingMenus),
    [remainingMenus]
  );

  // ----------------------------------------------------------------------------
  // "인원수로 나누기" 계산값
  // ----------------------------------------------------------------------------

  const remainingPersons = useMemo(
    () => persons.filter((person) => !paidPersonIds.has(person.id)),
    [persons, paidPersonIds]
  );

  const paidPersonAmount = useMemo(() => {
    return persons
      .filter((person) => paidPersonIds.has(person.id))
      .reduce((sum, person) => sum + (person.paidAmount ?? 0), 0);
  }, [persons, paidPersonIds]);

  const remainingPersonTotal = useMemo(
    () => totalPrice - paidPersonAmount,
    [totalPrice, paidPersonAmount]
  );

  const getPersonPrice = useCallback(
    (person: Person, allPersons: Person[]): number => {
      return calculatePersonPrice(person, allPersons, remainingPersonTotal);
    },
    [remainingPersonTotal]
  );

  const selectedPersonPrice = useMemo(() => {
    return remainingPersons
      .filter((person) => person.isSelected)
      .reduce((sum, person) => {
        return sum + getPersonPrice(person, remainingPersons);
      }, 0);
  }, [remainingPersons, getPersonPrice]);

  // ----------------------------------------------------------------------------
  // UI에서 사용하는 계산값
  // ----------------------------------------------------------------------------

  const currentSelectedPrice = isPaymentByMenu
    ? selectedMenuPrice
    : selectedPersonPrice;

  const currentRemainingPrice = isPaymentByMenu
    ? remainingMenuPrice
    : remainingPersonTotal;

  // ----------------------------------------------------------------------------
  // Payment 이벤트 리스너 설정
  // ----------------------------------------------------------------------------

  useEffect(() => {
    if (!modalData.isCardPaymentProgressModalOpened) {
      return;
    }

    let paymentListener: { remove: () => Promise<void> } | null = null;

    const setupPaymentListener = async () => {
      paymentListener = await Payment.addListener(
        PAYMENT_EVENT_NAME,
        (eventData: IPaymentEventData) => {
          setPaymentProgressMessage(eventData.EVENT_MSG);
        }
      );
      paymentListenerRef.current = paymentListener;
    };

    setupPaymentListener();

    return () => {
      Payment.stop();
      if (paymentListener) {
        paymentListener.remove();
      }
    };
  }, [modalData.isCardPaymentProgressModalOpened]);

  // ----------------------------------------------------------------------------
  // 주문 생성 및 결제 처리 함수
  // ----------------------------------------------------------------------------

  const createOrder = async (): Promise<PaymentResult> => {
    const orders = convertCartMenusToOrders(cartData.menus);
    const adjustedOrders = adjustOrderOptionQuantities(orders);

    const orderResponse = await createTableOrder({
      shopCode: shopData?.shopCode ?? '',
      tableNumber: deviceData?.tableNumber ?? '',
      orderType: ORDER_TYPE_PREPAYMENT,
      customerCount: customerCountData?.adultCount ?? 1,
      kidsCustomerCount: customerCountData?.childCount ?? 0,
      totalAmount: totalPrice.toString(),
      orders: adjustedOrders,
    }).catch((error) => {
      // 테이블이 삭제된 경우
      if (error.response?.status === HTTP_STATUS_BAD_REQUEST) {
        navigate(ROUTES.TABLES.generate());
      }
    });

    const orderGroupUuid = orderResponse?.data?.orderGroupUuid;
    const orderUuid = orderResponse?.data?.orderInfoList[0]?.orderUuid;

    if (!orderGroupUuid || !orderUuid) {
      openConfirmDialog({
        title: t('오류'),
        content: t('주문 생성에 실패했습니다.'),
        confirmText: t('확인'),
      });
      throw new Error('주문 생성에 실패했습니다.');
    }

    return { orderGroupUuid, orderUuid };
  };

  const ensureOrderCreated = async (): Promise<PaymentResult> => {
    if (orderGroupUuid && orderUuid) {
      return { orderGroupUuid, orderUuid };
    }

    const result = await createOrder();
    setOrderGroupUuid(result.orderGroupUuid);
    setOrderUuid(result.orderUuid);
    return result;
  };

  const executePayment = async (
    paymentAmount: number,
    onSuccess: () => void
  ): Promise<void> => {
    try {
      setModalData('isCardPaymentProgressModalOpened', true);

      // 5만원 미만이면 항상 일시불('00')으로 설정
      const installmentMonths =
        paymentAmount < INSTALLMENT_MINIMUM_AMOUNT
          ? INSTALLMENT_LUMP_SUM
          : selectedInstallmentMonths;

      // 1. Payment.approve를 먼저 실행
      const paymentResult: IPaymentResponse = await Payment.approve({
        amount: paymentAmount,
        installment: formatInstallmentMonthsToString(installmentMonths),
      });

      // 2. 처음 결제시에만 주문 생성, 이후에는 기존 주문 재사용
      const { orderGroupUuid, orderUuid } = await ensureOrderCreated();

      // 3. postPaymentApproval 실행
      await postPaymentApproval({
        params: {
          paymentMethodCode: shopDetailData?.shopSetting?.vanCode ?? 'EASY',
          orderGroupUuid,
          orderUuid,
        },
        data: paymentResult,
      });

      onSuccess();
    } catch (error) {
      if (isUserCancelError(error)) {
        setModalData('isCardPaymentProgressModalOpened', false);
        return;
      }
      handlePaymentError(error);
    }
  };

  const handlePaymentError = (error: unknown): void => {
    setModalData('isCardPaymentProgressModalOpened', false);

    const errorMessage =
      error instanceof Error
        ? error.message
        : t('결제 처리 중 오류가 발생했습니다.');

    openConfirmDialog({
      title: t('오류'),
      content: errorMessage,
      confirmText: t('확인'),
    });
  };

  const handlePaymentSuccess = (isAllPaid: boolean): void => {
    if (!isAllPaid) {
      setModalData('isCardPaymentProgressModalOpened', false);
      toast(t('결제를 성공했습니다.'), {
        duration: TOAST_DURATION,
        position: TOAST_POSITION,
      });
      return;
    }

    // 모든 결제 완료 시 (CardPaymentInstallmentModal과 동일)
    const orderData = convertCartMenusToOrders(cartData.menus);

    // 결제 성공 toast 표시
    toast(t('결제를 성공했습니다.'), {
      duration: TOAST_DURATION,
      position: TOAST_POSITION,
    });

    setModalData('orderCompleteData', orderData);
    setModalData('orderCompleteTotalPrice', totalPrice);
    setModalData('isOrderCompleteModalOpened', true);

    // 모든 모달 닫기
    setModalData('isCardPaymentProgressModalOpened', false);
    setModalData('isPaymentsModalOpened', false);
    setModalData('isCartListOpened', false);

    // 장바구니 비우기
    clearCart();

    // 현재 모달 닫기
    onClose();
  };

  const handlePaymentMethodChange = (changeToMenuMode: boolean): void => {
    if (isPaymentByMenu === changeToMenuMode) {
      return;
    }

    setIsPaymentByMenu(changeToMenuMode);

    // 선택 상태 초기화
    setSelectedMenus([]);
    setPersons((prev) =>
      prev.map((person) => ({ ...person, isSelected: false }))
    );
  };

  const handleMenuPayment = async (): Promise<void> => {
    if (selectedMenus.length === 0) {
      toast(t('선택된 메뉴가 없습니다.'), {
        position: TOAST_POSITION,
        duration: TOAST_DURATION,
      });
      return;
    }

    const selectedMenuIds = selectedMenus.map((menu) => menu.id);
    const isAllPaid = remainingMenus.length === selectedMenus.length;
    const paymentAmount = selectedMenuPrice;

    await executePayment(paymentAmount, () => {
      setPaidMenuIds((prev) => new Set([...prev, ...selectedMenuIds]));
      setSelectedMenus([]);
      handlePaymentSuccess(isAllPaid);
    });
  };

  const handlePersonPayment = async (): Promise<void> => {
    const selectedPersons = remainingPersons.filter(
      (person) => person.isSelected
    );

    if (selectedPersons.length === 0) {
      toast(t('선택된 인원이 없습니다.'), {
        position: TOAST_POSITION,
        duration: TOAST_DURATION,
      });
      return;
    }

    const selectedPersonsData = selectedPersons.map((person) => ({
      id: person.id,
      price: getPersonPrice(person, remainingPersons),
    }));
    const isAllPaid = remainingPersons.length === selectedPersons.length;
    const paymentAmount = selectedPersonPrice;

    await executePayment(paymentAmount, () => {
      setPaidPersonIds(
        (prev) => new Set([...prev, ...selectedPersonsData.map((p) => p.id)])
      );

      // 결제 금액을 paidAmount에 저장 (이후 합계 계산용)
      setPersons((prev) =>
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

      handlePaymentSuccess(isAllPaid);
    });
  };

  const handlePayment = (): void => {
    if (isPaymentByMenu) {
      // 5만원 이상이면 할부 선택 모달 열기
      if (selectedMenuPrice >= INSTALLMENT_MINIMUM_AMOUNT) {
        setIsInstallmentModalOpen(true);
      } else {
        // 5만원 미만이면 바로 결제 진행
        handleMenuPayment();
      }
    } else {
      // 인원 수로 나누기: 5만원 이상이면 할부 선택 모달 열기
      if (selectedPersonPrice >= INSTALLMENT_MINIMUM_AMOUNT) {
        setIsInstallmentModalOpen(true);
      } else {
        // 5만원 미만이면 바로 결제 진행
        handlePersonPayment();
      }
    }
  };

  const handleInstallmentModalConfirm = (selectedMonths: number): void => {
    setSelectedInstallmentMonths(selectedMonths);
    setIsInstallmentModalOpen(false);
    if (isPaymentByMenu) {
      handleMenuPayment();
    } else {
      handlePersonPayment();
    }
  };

  const handleInstallmentModalClose = (): void => {
    setIsInstallmentModalOpen(false);
  };

  const hasAnyPayment = paidMenuIds.size > 0 || paidPersonIds.size > 0;

  return (
    <>
      <ModalBackground>
        <S.Container
          role="dialog"
          aria-modal="true"
          aria-labelledby="split-payment-title"
        >
          {!hasAnyPayment && (
            <S.CloseButton
              type="button"
              onClick={onClose}
              aria-label={t('모달 닫기')}
            >
              <CloseIcon width={32} height={32} color={theme.mode.grey[700]} />
            </S.CloseButton>
          )}

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
                  menus={remainingMenus}
                  selectedMenus={selectedMenus}
                  setSelectedMenus={setSelectedMenus}
                />
              )}

              {!isPaymentByMenu && (
                <PriceSelector
                  totalPrice={remainingPersonTotal}
                  persons={remainingPersons}
                  setPersons={setPersons}
                  hasAnyPayment={paidPersonIds.size > 0}
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

      {/* 할부 선택 모달 */}
      {isInstallmentModalOpen && (
        <SplitPaymentInstallmentModal
          onClose={handleInstallmentModalClose}
          totalPrice={currentSelectedPrice}
          onConfirm={handleInstallmentModalConfirm}
        />
      )}

      {/* 카드 결제 진행 모달 */}
      {modalData.isCardPaymentProgressModalOpened && (
        <CardPaymentProgressModal
          onClose={() =>
            setModalData('isCardPaymentProgressModalOpened', false)
          }
          message={paymentProgressMessage}
        />
      )}
    </>
  );
};
