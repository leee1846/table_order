import { BasicButton, ModalBackground } from '@repo/ui/components';
import * as S from '@/pages/MainPage/SplitPaymentModal/splitPaymentModal.style';
import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { MenuSelector } from '@/pages/MainPage/SplitPaymentModal/MenuSelector';
import { PriceSelector } from '@/pages/MainPage/SplitPaymentModal/PriceSelector';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { CloseIcon } from '@repo/ui/icons';
import { useThemeMode } from '@repo/ui';
import { useCartStore } from '@/stores/useCartStore';
import type { ICartMenuWithId, ICartMenu } from '@/types/cart';
import { formatCurrency } from '@repo/util/string';
import { useDeviceStore } from '@/stores/useDeviceStore';
import { calculateMenuTotalPrice } from '@/utils/calculation';
import { toast, openConfirmDialog } from '@repo/feature/utils';
import { useModalStore } from '@/stores/useModalStore';
// import { CardPaymentProgressModal } from '@/pages/MainPage/CardPaymentProgressModal';
import { SplitPaymentInstallmentModal } from './SplitPaymentInstallmentModal';
import {
  Payment,
  type IPaymentResponse,
  // type IPaymentEventData,
} from '@repo/util/app';
import { usePostPaymentApproval, usePostTableOrder } from '@repo/api/queries';
import type { IOrder } from '@repo/api/types';
import { useCustomerCountStore } from '@/stores/useCustomerCountStore';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import {
  INSTALLMENT_MINIMUM_AMOUNT,
  INSTALLMENT_LUMP_SUM,
  formatInstallmentMonthsToString,
} from '@/feature/Installment';
import { usePosOrderStore } from '@repo/feature/stores';
import { useShopStore } from '@/stores/useShopStore';
import { useShopDetailStore } from '@/stores/useShopDetailStore';
import { useTableGroupStore } from '@/stores/useTableGroupStore';

interface Props {
  onClose: () => void;
}

const ORDER_TYPE_PREPAYMENT = 'PREPAYMENT';
// const PAYMENT_EVENT_NAME = 'paymentEvent';
const HTTP_STATUS_BAD_REQUEST = 400;
const HTTP_STATUS_SERVER_ERROR = 500;
const HTTP_STATUS_NOT_FOUND = 404;
const HTTP_STATUS_METHOD_NOT_ALLOWED = 405;
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

/**
 * 단일 메뉴의 총 가격 계산 (메뉴 가격 + 옵션 가격)
 */
const calculateSingleMenuPrice = (menu: ICartMenu): number => {
  const options = menu.selectedOptions.map((option) => ({
    optionPrice: option.optionPrice,
    quantity: option.quantity,
  }));

  return calculateMenuTotalPrice(menu.menuPrice, menu.quantity, options);
};

/**
 * 여러 메뉴의 총 가격 합계 계산
 */
const calculateTotalMenusPrice = (menus: ICartMenu[]): number => {
  return menus.reduce(
    (totalPrice, menu) => totalPrice + calculateSingleMenuPrice(menu),
    0
  );
};

/**
 * 개별 인원의 분담 금액 계산
 * @param person - 계산 대상 인원
 * @param allPersons - 전체 인원 목록
 * @param remainingTotal - 남은 총 금액
 * @returns 계산된 분담 금액
 *
 * 계산 로직:
 * 1. 커스텀 금액이 설정된 경우: 해당 금액 반환
 * 2. 커스텀 금액이 없는 경우: 남은 금액을 균등 분배
 *    - 남은 금액 = 전체 금액 - 커스텀 금액 합계
 *    - 기본 금액 = 남은 금액 / 인원 수 (내림)
 *    - 첫 번째 인원에게 나머지 금액 할당 (원 단위 정확도 유지)
 */
const calculatePersonPrice = (
  person: Person,
  allPersons: Person[],
  remainingTotal: number
): number => {
  // 커스텀 금액이 설정된 경우 그대로 반환
  if (person.customPrice !== undefined) {
    return person.customPrice;
  }

  // 커스텀 금액이 없는 인원들만 필터링
  const personsWithoutCustomPrice = allPersons.filter(
    (p) => p.customPrice === undefined
  );
  const countToSplit = personsWithoutCustomPrice.length;

  // 균등 분배 대상이 없으면 0원
  if (countToSplit === 0) {
    return 0;
  }

  // 커스텀 금액 총합 계산
  const totalCustomAmount = allPersons.reduce(
    (sum, p) => sum + (p.customPrice ?? 0),
    0
  );
  // 균등 분배할 금액 = 남은 총 금액 - 커스텀 금액 총합
  const amountToSplit = Math.max(remainingTotal - totalCustomAmount, 0);

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
 * 장바구니 데이터를 주문 API 형식으로 변환
 * 메뉴와 옵션 정보를 주문 데이터 구조에 맞게 변환
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
 * 예: 메뉴 2개, 옵션 1개 → 옵션 수량 = 2 × 1 = 2개
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

/**
 * 사용자 취소 에러 여부 확인
 * 결제 과정에서 사용자가 취소한 경우를 판별
 */
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

  const deviceData = useDeviceStore((s) => s.data);
  const { data: cartData, clearCart } = useCartStore();
  const { data: modalData, setModalData } = useModalStore();
  const { data: shopData } = useShopStore();
  const { data: customerCountData } = useCustomerCountStore();

  const { mutateAsync: createTableOrder } = usePostTableOrder({
    ignoreGlobalErrors: [
      HTTP_STATUS_BAD_REQUEST,
      HTTP_STATUS_SERVER_ERROR,
      HTTP_STATUS_NOT_FOUND,
      HTTP_STATUS_METHOD_NOT_ALLOWED,
    ],
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
  // const [paymentProgressMessage, setPaymentProgressMessage] =
  //   useState<string>('');
  // const paymentListenerRef = useRef<{ remove: () => Promise<void> } | null>(
  //   null
  // );

  // 할부 선택
  const [selectedInstallmentMonths, setSelectedInstallmentMonths] =
    useState<number>(INSTALLMENT_LUMP_SUM);

  /** 결제만 완료된 미연결 결제. ensureOrderCreated 실패 후 cancel 실패 시 세팅, 다음 결제 시 RB 취소 후 제거 */
  const [pendingPaymentCancel, setPendingPaymentCancel] =
    useState<IPaymentResponse | null>(null);

  /**
   * POS 실패 시 환불 처리를 위해 누적된 완료된 카드 결제 결과 목록
   * ref 사용 이유: handleOrderCompleteFailure가 register에 전달될 때 스테일 클로저를 피하기 위함
   */
  const completedPaymentResultsRef = useRef<IPaymentResponse[]>([]);

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

  /**
   * 전체 메뉴 목록 (수량만큼 개별 항목으로 펼침)
   * 예: 메뉴 A 2개 → [메뉴 A-0, 메뉴 A-1]
   * 개별 선택을 위해 각 메뉴에 고유 ID 부여
   */
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

  /**
   * 전체 결제 금액 (모든 메뉴의 합계)
   */
  const totalPrice = useMemo(
    () => calculateTotalMenusPrice(cartData.menus),
    [cartData.menus]
  );

  // ----------------------------------------------------------------------------
  // "메뉴별 나누기" 계산값
  // ----------------------------------------------------------------------------

  /**
   * 남은 메뉴 목록 (결제 완료된 메뉴 제외)
   */
  const remainingMenus = useMemo(
    () => allMenus.filter((menu) => !paidMenuIds.has(menu.id)),
    [allMenus, paidMenuIds]
  );

  /**
   * 선택된 메뉴들의 총 금액
   */
  const selectedMenuPrice = useMemo(
    () => calculateTotalMenusPrice(selectedMenus),
    [selectedMenus]
  );

  /**
   * 남은 메뉴들의 총 금액
   */
  const remainingMenuPrice = useMemo(
    () => calculateTotalMenusPrice(remainingMenus),
    [remainingMenus]
  );

  // ----------------------------------------------------------------------------
  // "인원수로 나누기" 계산값
  // ----------------------------------------------------------------------------

  /**
   * 남은 인원 목록 (결제 완료된 인원 제외)
   */
  const remainingPersons = useMemo(
    () => persons.filter((person) => !paidPersonIds.has(person.id)),
    [persons, paidPersonIds]
  );

  /**
   * 결제 완료된 인원들의 총 금액
   */
  const paidPersonAmount = useMemo(() => {
    return persons
      .filter((person) => paidPersonIds.has(person.id))
      .reduce((sum, person) => sum + (person.paidAmount ?? 0), 0);
  }, [persons, paidPersonIds]);

  /**
   * 남은 인원들에게 분배할 총 금액 = 전체 금액 - 결제 완료 금액
   */
  const remainingPersonTotal = useMemo(
    () => totalPrice - paidPersonAmount,
    [totalPrice, paidPersonAmount]
  );

  /**
   * 인원별 분담 금액 계산 (메모이제이션)
   * remainingPersonTotal이 변경될 때만 재계산
   */
  const getPersonPrice = useCallback(
    (person: Person, allPersons: Person[]): number => {
      return calculatePersonPrice(person, allPersons, remainingPersonTotal);
    },
    [remainingPersonTotal]
  );

  /**
   * 선택된 인원들의 총 금액
   */
  const selectedPersonPrice = useMemo(() => {
    return remainingPersons
      .filter((person) => person.isSelected)
      .reduce((totalAmount, person) => {
        return totalAmount + getPersonPrice(person, remainingPersons);
      }, 0);
  }, [remainingPersons, getPersonPrice]);

  // ----------------------------------------------------------------------------
  // UI에서 사용하는 계산값
  // ----------------------------------------------------------------------------

  /**
   * 현재 선택된 항목의 총 금액 (메뉴별/인원별 모드에 따라 다름)
   */
  const currentSelectedPrice = isPaymentByMenu
    ? selectedMenuPrice
    : selectedPersonPrice;

  /**
   * 현재 남은 총 금액 (메뉴별/인원별 모드에 따라 다름)
   */
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

    // let paymentListener: { remove: () => Promise<void> } | null = null;

    // const setupPaymentListener = async () => {
    //   paymentListener = await Payment.addListener(
    //     PAYMENT_EVENT_NAME,
    //     (eventData: IPaymentEventData) => {
    //       setPaymentProgressMessage(eventData.EVENT_MSG);
    //     }
    //   );
    //   paymentListenerRef.current = paymentListener;
    // };

    // setupPaymentListener();

    return () => {
      Payment.stop();
      // if (paymentListener) {
      //   paymentListener.remove();
      // }
    };
  }, [modalData.isCardPaymentProgressModalOpened]);

  // ----------------------------------------------------------------------------
  // 주문 생성 및 결제 처리 함수
  // ----------------------------------------------------------------------------

  /**
   * 신규 주문 생성
   * 장바구니 데이터를 기반으로 서버에 주문 생성 요청
   * @returns 생성된 주문의 UUID 정보
   */
  const createOrder = async (): Promise<PaymentResult> => {
    // 1. 장바구니 데이터를 주문 형식으로 변환
    const orders = convertCartMenusToOrders(cartData.menus);
    // 2. 옵션 수량 조정 (메뉴 수량 × 옵션 수량)
    const adjustedOrders = adjustOrderOptionQuantities(orders);

    // 3. 주문 생성 API 호출
    const orderResponse = await createTableOrder({
      shopCode: shopData?.shopCode ?? '',
      tableNumber: deviceData?.tableNumber ?? '',
      orderType: ORDER_TYPE_PREPAYMENT,
      customerCount: customerCountData?.adultCount ?? 1,
      kidsCustomerCount: customerCountData?.childCount ?? 0,
      totalAmount: totalPrice.toString(),
      orders: adjustedOrders,
    }).catch((error) => {
      // 테이블이 삭제된 경우 테이블 선택 페이지로 이동
      if (error.response?.status === HTTP_STATUS_BAD_REQUEST) {
        navigate(ROUTES.TABLES.generate());
      }
    });

    // 4. 응답에서 주문 UUID 추출
    const orderGroupUuid = orderResponse?.data?.orderGroupUuid;
    const orderUuid = orderResponse?.data?.orderInfoList.at(-1)?.orderUuid;

    // 5. UUID가 없으면 에러 처리
    if (!orderGroupUuid || !orderUuid) {
      throw new Error('주문 생성에 실패했습니다.');
    }

    return { orderGroupUuid, orderUuid };
  };

  /**
   * 주문 생성 보장
   * 이미 생성된 주문이 있으면 재사용, 없으면 새로 생성
   * @returns 주문 UUID 정보
   */
  const ensureOrderCreated = async (): Promise<PaymentResult> => {
    // 이미 생성된 주문이 있으면 재사용
    if (orderGroupUuid && orderUuid) {
      return { orderGroupUuid, orderUuid };
    }

    // 신규 주문 생성 및 상태 저장
    const result = await createOrder();
    setOrderGroupUuid(result.orderGroupUuid);
    setOrderUuid(result.orderUuid);
    return result;
  };

  /**
   * 카드 결제 실행
   * @param paymentAmount - 결제할 금액
   * @param onSuccess - 결제 성공 시 실행할 콜백
   *
   * 실행 순서:
   * 1. 카드 결제 진행 모달 표시
   * 2. 할부 개월 수 결정 (5만원 미만은 일시불)
   * 3. Payment.approve 호출 (카드 단말기 승인)
   * 4. 주문 생성 또는 기존 주문 재사용
   * 5. postPaymentApproval 호출 (서버에 결제 승인 정보 전송)
   * 6. 성공 콜백 실행
   */
  const executePayment = async (
    paymentAmount: number,
    onSuccess: (
      orderUuidFromPayment: string,
      paymentResult: IPaymentResponse
    ) => void
  ): Promise<void> => {
    try {
      // 결제만 완료된 미연결 결제(이전 재시도 실패 분)가 있으면 RB 취소 후 제거 (중복 결제 방지)
      if (pendingPaymentCancel && pendingPaymentCancel.TRAN_NO) {
        try {
          await Payment.cancel(pendingPaymentCancel);
        } catch {
          // 환불 실패 시 → 사용자에게 재시도 환불 진행 안내 처리
          const err = new Error(t('환불 처리 중 오류가 발생했습니다.'));
          (
            err as Error & { hasPendingPaymentCancel?: boolean }
          ).hasPendingPaymentCancel = true;
          throw err;
        }

        setPendingPaymentCancel(null);
      }

      // 1. 결제 진행 모달 표시
      setModalData('isCardPaymentProgressModalOpened', true);

      // 2. 할부 개월 수 결정 (5만원 미만은 일시불 강제)
      const installmentMonths =
        paymentAmount < INSTALLMENT_MINIMUM_AMOUNT
          ? INSTALLMENT_LUMP_SUM
          : selectedInstallmentMonths;

      // 3. 카드 단말기 승인 요청
      const paymentResult: IPaymentResponse = await Payment.approve({
        amount: paymentAmount,
        installment: formatInstallmentMonthsToString(installmentMonths),
      });

      // 4. 주문 생성 또는 재사용 (첫 결제 시에만 생성)
      let orderGroupUuid: string;
      let orderUuid: string;
      try {
        const orderResult = await ensureOrderCreated();
        orderGroupUuid = orderResult.orderGroupUuid;
        orderUuid = orderResult.orderUuid;
      } catch {
        try {
          await Payment.cancel(paymentResult);
        } catch {
          setPendingPaymentCancel(paymentResult);
          // 환불 실패 시 → 사용자에게 재시도 환불 진행 안내 처리
          const err = new Error(t('결제 처리 중 오류가 발생했습니다.'));
          (
            err as Error & { hasPendingPaymentCancel?: boolean }
          ).hasPendingPaymentCancel = true;
          throw err;
        }
        throw new Error(t('결제 처리 중 오류가 발생했습니다.'));
      }

      // 5. 서버에 결제 승인 정보 전송 (실패 시 에러 무시)
      try {
        const shopDetailData = useShopDetailStore.getState().data;
        await postPaymentApproval({
          params: {
            paymentMethodCode: shopDetailData?.shopSetting?.vanCode ?? 'EASY',
            orderGroupUuid,
            orderUuid,
          },
          data: paymentResult,
          ignoreGlobalErrors: [
            HTTP_STATUS_BAD_REQUEST,
            HTTP_STATUS_SERVER_ERROR,
            HTTP_STATUS_NOT_FOUND,
          ],
        });
      } catch {
        // postPaymentApproval 실패는 무시
      }

      // 6. 성공 콜백 실행 (setState 반영 전에 사용하기 위해 orderUuid, paymentResult 인자로 전달)
      onSuccess(orderUuid, paymentResult);
    } catch (error) {
      // 사용자가 결제를 취소한 경우
      if (isUserCancelError(error)) {
        setModalData('isCardPaymentProgressModalOpened', false);
        return;
      }
      // 기타 오류 처리
      handlePaymentError(error);
    }
  };

  /**
   * 결제 오류 처리
   * 오류 메시지를 사용자에게 표시
   */
  const handlePaymentError = (error: unknown): void => {
    setModalData('isCardPaymentProgressModalOpened', false);

    const errorMessage =
      error instanceof Error
        ? error.message
        : t('결제 처리 중 오류가 발생했습니다.');

    const hasPendingPaymentCancel =
      error instanceof Error &&
      (error as Error & { hasPendingPaymentCancel?: boolean })
        .hasPendingPaymentCancel === true;
    const content = hasPendingPaymentCancel
      ? `${errorMessage}\n\n${t('다시 결제를 시도하시면 이전 결제 내역이 환불된 후 결제가 진행됩니다.')}`
      : errorMessage;

    openConfirmDialog({
      title: t('오류'),
      content,
      confirmText: t('확인'),
    });
  };

  /**
   * POS 오류 공통 처리: 다이얼로그 표시 및 모달 닫기
   */
  const closePosErrorModals = (): void => {
    openConfirmDialog({
      title: t('POS 오류'),
      content: t('주문 요청에 실패했습니다. 사장님에게 문의해주세요.'),
      confirmText: t('확인'),
    });

    setModalData('isCardPaymentProgressModalOpened', false);
    setModalData('isPaymentsModalOpened', false);
    setModalData('isCartListOpened', false);
    onClose();
  };

  /**
   * POS 타임아웃(최대 횟수 초과) 시 실행할 처리
   * POS 응답 미확인 상태이므로 환불하지 않음
   */
  const handleOrderCompleteTimeout = (): void => {
    closePosErrorModals();
  };

  /**
   * POS 실패(-603 또는 API 에러) 시 실행할 처리
   * 분할 결제로 완료된 모든 카드 결제를 순차적으로 취소(환불)한 후 오류 처리
   */
  const handleOrderCompleteFailure = async (): Promise<void> => {
    for (const result of completedPaymentResultsRef.current) {
      try {
        await Payment.cancel(result);
      } catch {
        // 개별 취소 실패 시 무시하고 다음 건 진행
      }
    }

    closePosErrorModals();
  };

  /**
   * 결제 성공 처리
   * @param isAllPaid - 전체 결제 완료 여부
   * @param orderUuidFromPayment - executePayment에서 전달한 주문 UUID (setState 비동기 이슈 방지)
   *
   * - 부분 결제 시: 성공 메시지만 표시
   * - 전체 결제 완료 시: 주문 완료 모달 표시, 장바구니 비우기
   */
  const handlePaymentSuccess = (
    isAllPaid: boolean,
    orderUuidFromPayment?: string
  ): void => {
    // 부분 결제 완료
    if (!isAllPaid) {
      setModalData('isCardPaymentProgressModalOpened', false);
      toast(t('결제를 성공했습니다.'), {
        duration: TOAST_DURATION,
        position: TOAST_POSITION,
      });
      return;
    }

    const runFullSuccess = (): void => {
      const orderData = convertCartMenusToOrders(cartData.menus);

      toast(t('결제를 성공했습니다.'), {
        duration: TOAST_DURATION,
        position: TOAST_POSITION,
      });

      setModalData('orderCompleteData', orderData);
      setModalData('orderCompleteTotalPrice', totalPrice);
      setModalData('isOrderCompleteModalOpened', true);

      setModalData('isCardPaymentProgressModalOpened', false);
      setModalData('isPaymentsModalOpened', false);
      setModalData('isCartListOpened', false);

      clearCart();
      onClose();
    };

    const shopDetailData = useShopDetailStore.getState().data;
    const isPosLinked =
      !!shopDetailData?.shopSetting?.shopPosCode &&
      shopDetailData?.shopSetting?.shopPosCode !== 'NONE';

    // 전체 결제 완료: POS 연동 시 ORDER_COMPLETE 대기 및 폴링
    if (isPosLinked && orderUuidFromPayment) {
      const shopCode = String(shopData?.shopCode ?? '');
      usePosOrderStore.getState().register(
        orderUuidFromPayment,
        shopCode,
        runFullSuccess,
        handleOrderCompleteFailure,
        // 타임아웃(최대 횟수 초과)은 POS 응답 미확인 상태이므로 환불하지 않음
        handleOrderCompleteTimeout
      );
      return;
    }

    // 전체 결제 완료 (POS 미연동 또는 즉시 완료)
    runFullSuccess();
  };

  /**
   * 결제 방식 변경 핸들러
   * 탭 전환 시 이전 탭의 모든 상태 초기화
   * @param changeToMenuMode - true: 메뉴별 나누기, false: 인원 수로 나누기
   */
  const handlePaymentMethodChange = (changeToMenuMode: boolean): void => {
    // 이미 선택된 모드면 무시
    if (isPaymentByMenu === changeToMenuMode) {
      return;
    }

    setIsPaymentByMenu(changeToMenuMode);

    if (changeToMenuMode) {
      // 메뉴별 나누기로 전환: 인원 관련 상태 초기화
      setPersons(() =>
        Array.from({ length: INITIAL_PERSON_COUNT }, (_, index) => ({
          id: `person-${index}`,
          isSelected: false,
        }))
      );
      setPaidPersonIds(new Set());
    } else {
      // 인원 수로 나누기로 전환: 메뉴 관련 상태 초기화
      setSelectedMenus([]);
      setPaidMenuIds(new Set());
    }
  };

  /**
   * 메뉴별 결제 핸들러
   * 선택된 메뉴들의 금액을 결제하고 결제 완료 상태 업데이트
   *
   * 결제 완료 조건:
   * - 남은 메뉴를 모두 선택했거나
   * - 결제 후 남은 금액이 0원 이하
   */
  const handleMenuPayment = async (): Promise<void> => {
    // 선택된 메뉴 검증
    if (selectedMenus.length === 0) {
      toast(t('선택된 메뉴가 없습니다.'), {
        position: TOAST_POSITION,
        duration: TOAST_DURATION,
      });
      return;
    }

    const selectedMenuIds = selectedMenus.map((menu) => menu.id);
    const paymentAmount = selectedMenuPrice;

    // 전체 결제 완료 여부 판단
    const isAllPaid =
      remainingMenus.length === selectedMenus.length ||
      remainingMenuPrice - paymentAmount <= 0;

    // 결제 실행 및 성공 시 상태 업데이트
    await executePayment(
      paymentAmount,
      (orderUuidFromPayment, paymentResult) => {
        completedPaymentResultsRef.current = [
          ...completedPaymentResultsRef.current,
          paymentResult,
        ];
        setPaidMenuIds((prevIds) => new Set([...prevIds, ...selectedMenuIds]));
        setSelectedMenus([]);
        handlePaymentSuccess(isAllPaid, orderUuidFromPayment);
      }
    );
  };

  /**
   * 인원별 결제 핸들러
   * 선택된 인원들의 금액을 결제하고 결제 완료 상태 업데이트
   *
   * 결제 완료 조건:
   * - 남은 인원을 모두 선택했거나
   * - 결제 후 남은 금액이 0원 이하
   */
  const handlePersonPayment = async (): Promise<void> => {
    const selectedPersons = remainingPersons.filter(
      (person) => person.isSelected
    );

    // 선택된 인원 검증
    if (selectedPersons.length === 0) {
      toast(t('선택된 인원이 없습니다.'), {
        position: TOAST_POSITION,
        duration: TOAST_DURATION,
      });
      return;
    }

    // 선택된 인원별 결제 금액 계산
    const selectedPersonsData = selectedPersons.map((person) => ({
      id: person.id,
      price: getPersonPrice(person, remainingPersons),
    }));
    const paymentAmount = selectedPersonPrice;

    // 전체 결제 완료 여부 판단
    const isAllPaid =
      remainingPersons.length === selectedPersons.length ||
      remainingPersonTotal - paymentAmount <= 0;

    // 결제 실행 및 성공 시 상태 업데이트
    await executePayment(
      paymentAmount,
      (orderUuidFromPayment, paymentResult) => {
        completedPaymentResultsRef.current = [
          ...completedPaymentResultsRef.current,
          paymentResult,
        ];

        // 결제 완료된 인원 ID 저장
        setPaidPersonIds(
          (prevIds) =>
            new Set([...prevIds, ...selectedPersonsData.map((p) => p.id)])
        );

        // 결제 완료된 인원의 paidAmount 저장 (합계 계산용)
        setPersons((prevPersons) =>
          prevPersons.map((person) => {
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

        handlePaymentSuccess(isAllPaid, orderUuidFromPayment);
      }
    );
  };

  /**
   * 결제 버튼 클릭 핸들러
   * 결제 금액에 따라 할부 선택 모달 표시 또는 즉시 결제
   * - 5만원 이상: 할부 선택 모달 표시
   * - 5만원 미만: 일시불로 즉시 결제
   */
  const handlePayment = (): void => {
    if (isPaymentByMenu) {
      // 메뉴별 나누기 모드
      if (selectedMenuPrice >= INSTALLMENT_MINIMUM_AMOUNT) {
        setIsInstallmentModalOpen(true);
      } else {
        handleMenuPayment();
      }
    } else {
      // 인원 수로 나누기 모드
      if (selectedPersonPrice >= INSTALLMENT_MINIMUM_AMOUNT) {
        setIsInstallmentModalOpen(true);
      } else {
        handlePersonPayment();
      }
    }
  };

  /**
   * 할부 선택 모달 확인 핸들러
   * 선택한 할부 개월 수로 결제 진행
   * @param selectedMonths - 선택한 할부 개월 수
   */
  const handleInstallmentModalConfirm = (selectedMonths: number): void => {
    setSelectedInstallmentMonths(selectedMonths);
    setIsInstallmentModalOpen(false);

    if (isPaymentByMenu) {
      handleMenuPayment();
    } else {
      handlePersonPayment();
    }
  };

  /**
   * 할부 선택 모달 닫기 핸들러
   */
  const handleInstallmentModalClose = (): void => {
    setIsInstallmentModalOpen(false);
  };

  /**
   * 결제 진행 여부 (어떤 항목이라도 결제된 경우 true)
   */
  const hasAnyPayment = paidMenuIds.size > 0 || paidPersonIds.size > 0;

  const tableGroupsData = useTableGroupStore((s) => s.data);
  const tableName = tableGroupsData?.map((tableGroup) => {
    const table = tableGroup.tableList?.find(
      (table) => table.tableNumber === deviceData?.tableNumber
    );
    return table?.tableName ?? '';
  });

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
                  paidPersonIds={paidPersonIds}
                  hasAnyPayment={paidPersonIds.size > 0}
                />
              )}

              <S.SelectorTotalContainer role="region" aria-live="polite">
                <S.TotalInfo>
                  <h3>{t('총 결제금액')}</h3>
                  <p>₩{formatCurrency(totalPrice)}</p>
                </S.TotalInfo>
                <S.RemainingAmount>
                  <h3>{t('남은 결제 금액')}</h3>
                  <p>₩{formatCurrency(currentRemainingPrice)}</p>
                </S.RemainingAmount>
              </S.SelectorTotalContainer>
            </S.SelectorContainer>
          </S.LeftContainer>

          <S.RightContainer>
            <h2>
              {tableName} {t('총 주문내역')}
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
                          <p>
                            {formatCurrency(
                              option.optionPrice * option.quantity
                            )}
                          </p>
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
                aria-label={t('₩{{amount}} 카드 결제', {
                  amount: formatCurrency(currentSelectedPrice),
                })}
              >
                {t('₩{{amount}} 카드 결제', {
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
      {/* {modalData.isCardPaymentProgressModalOpened && (
        <CardPaymentProgressModal
          onClose={() =>
            setModalData('isCardPaymentProgressModalOpened', false)
          }
          message={paymentProgressMessage}
        />
      )} */}
    </>
  );
};
