import { STORAGE_KEYS } from '@/constants/keys';
import { create } from '@repo/feature/zustand';
import type { IOrder } from '@repo/api/types';
import { AppStorage } from '@repo/util/app';

interface IModalStore {
  data: {
    /** 장바구니 모달 */
    isCartListOpened: boolean;
    /** 장바구니 > 메뉴 상세 모달 */
    isCartMenuDetailModalOpened: boolean;
    /** 주문 내역 모달 */
    isOrderHistoryModalOpened: boolean;
    /** 직원 호출 모달 */
    isStaffCallModalOpened: boolean;
    /** 언어 선택 모달 */
    isLanguageSelectorModalOpened: boolean;
    /** 메뉴 상세 모달 - 열린 메뉴의 menuSeq (null이면 닫힌 상태) */
    openedMenuDetailSeq: number | null;
    /** 결제 방법 선택 모달 */
    isPaymentsModalOpened: boolean;
    /** 분할 결제 모달 */
    isSplitPaymentModalOpened: boolean;
    /** 카드 결제 할부 선택 모달 */
    isCardPaymentInstallmentModalOpened: boolean;
    /** 카드 결제 진행 모달 */
    isCardPaymentProgressModalOpened: boolean;
    /** 주문 완료 모달 */
    isOrderCompleteModalOpened: boolean;
    /** 주문 완료 모달 데이터 */
    orderCompleteData: IOrder[] | null;
    /** 주문 완료 모달 총 가격 */
    orderCompleteTotalPrice: number;
    /**
     * 선불 카드 단일 결제 또는 분할 결제 마지막 차수로 연 주문 완료 모달인지
     * (모달 닫을 때 선불 자동 리셋 등 분기용, 그 외 경로에서는 false)
     */
    isOrderCompleteFromPrepaidCardOrFinalSplit: boolean;
    /** 현금 결제 유도 모달 */
    isCashPaymentInducementModalOpened: boolean;
    /** 현금 결제 유도 모달 총 가격 */
    cashPaymentInducementTotalPrice: number;
  };

  setModalData: <K extends keyof IModalStore['data']>(
    dataKey: K,
    value: IModalStore['data'][K]
  ) => void;

  /** 메뉴 상세 모달 열기 */
  openMenuDetail: (menuSeq: number) => void;

  /** 메뉴 상세 모달 닫기 */
  closeMenuDetail: () => void;

  /** 모든 모달 닫기 */
  closeAllModals: () => void;

  /** 모든 모달이 닫혀있는지 확인 */
  isAllModalsClosed: () => boolean;

  /** 현금 결제 유도 모달 열기/닫기 및 총 가격 설정 (AppStorage 동기화) */
  setCashPaymentInducementModal: (
    isOpened: boolean,
    totalPrice: number
  ) => void;

  /** 현금 결제 유도 모달 정보 제거 (스토어 + AppStorage) */
  clearCashPaymentInducementModal: () => void;
}

const initialData = {
  isCartListOpened: false,
  isCartMenuDetailModalOpened: false,
  isOrderHistoryModalOpened: false,
  isStaffCallModalOpened: false,
  isLanguageSelectorModalOpened: false,
  openedMenuDetailSeq: null,
  isPaymentsModalOpened: false,
  isSplitPaymentModalOpened: false,
  isCardPaymentInstallmentModalOpened: false,
  isCardPaymentProgressModalOpened: false,
  isOrderCompleteModalOpened: false,
  orderCompleteData: null,
  orderCompleteTotalPrice: 0,
  isOrderCompleteFromPrepaidCardOrFinalSplit: false,
  isCashPaymentInducementModalOpened: false,
  cashPaymentInducementTotalPrice: 0,
};

/**
 * 모든 모달의 열림/닫힘 상태를 중앙에서 관리하는 Zustand 스토어
 *
 * @description
 * - 앱 내 모든 모달의 상태를 통합 관리합니다
 * - 장바구니, 주문 내역, 결제, 직원 호출 등 다양한 모달을 관리합니다
 * - 모든 모달이 닫혀있는지 확인하는 유틸리티 함수를 제공합니다
 */
type CashPaymentInducementStored = {
  isCashPaymentInducementModalOpened: boolean;
  cashPaymentInducementTotalPrice: number;
};

export const useModalStore = create<IModalStore>((set, get) => {
  // AppStorage에서 현금 결제 유도 모달 상태 초기 로드
  AppStorage.loadData<CashPaymentInducementStored>({
    key: STORAGE_KEYS.CASH_PAYMENT_INDUCEMENT_MODAL,
  }).then((result) => {
    if (
      result?.value &&
      typeof result.value.isCashPaymentInducementModalOpened === 'boolean'
    ) {
      set((state) => ({
        data: {
          ...state.data,
          isCashPaymentInducementModalOpened:
            result?.value?.isCashPaymentInducementModalOpened ?? false,
          cashPaymentInducementTotalPrice:
            typeof result?.value?.cashPaymentInducementTotalPrice === 'number'
              ? (result?.value?.cashPaymentInducementTotalPrice ?? 0)
              : 0,
        },
      }));
    }
  });

  return {
    // 초기 상태
    data: initialData,

    setModalData: <K extends keyof IModalStore['data']>(
      dataKey: K,
      value: IModalStore['data'][K]
    ) => set((state) => ({ data: { ...state.data, [dataKey]: value } })),

    // 메뉴 상세 모달 열기
    openMenuDetail: (menuSeq: number) =>
      set((state) => ({
        data: { ...state.data, openedMenuDetailSeq: menuSeq },
      })),

    // 메뉴 상세 모달 닫기
    closeMenuDetail: () =>
      set((state) => ({ data: { ...state.data, openedMenuDetailSeq: null } })),

    setCashPaymentInducementModal: (isOpened: boolean, totalPrice: number) => {
      set((state) => ({
        data: {
          ...state.data,
          isCashPaymentInducementModalOpened: isOpened,
          cashPaymentInducementTotalPrice: totalPrice,
        },
      }));
      AppStorage.saveData({
        key: STORAGE_KEYS.CASH_PAYMENT_INDUCEMENT_MODAL,
        value: {
          isCashPaymentInducementModalOpened: isOpened,
          cashPaymentInducementTotalPrice: totalPrice,
        },
        isTemporary: false,
      });
    },

    clearCashPaymentInducementModal: () => {
      AppStorage.removeData({
        key: STORAGE_KEYS.CASH_PAYMENT_INDUCEMENT_MODAL,
      });
      set((state) => ({
        data: {
          ...state.data,
          isCashPaymentInducementModalOpened: false,
          cashPaymentInducementTotalPrice: 0,
        },
      }));
    },

    // 모든 모달 닫기
    closeAllModals: () => {
      AppStorage.removeData({
        key: STORAGE_KEYS.CASH_PAYMENT_INDUCEMENT_MODAL,
      });
      set({
        data: initialData,
      });
    },

    // 모든 모달이 닫혀있는지 확인
    isAllModalsClosed: () => {
      const { data } = get();
      return (
        !data.isCartListOpened &&
        !data.isCartMenuDetailModalOpened &&
        !data.isOrderHistoryModalOpened &&
        !data.isStaffCallModalOpened &&
        !data.isLanguageSelectorModalOpened &&
        data.openedMenuDetailSeq === null &&
        !data.isPaymentsModalOpened &&
        !data.isSplitPaymentModalOpened &&
        !data.isCardPaymentInstallmentModalOpened &&
        !data.isCardPaymentProgressModalOpened &&
        !data.isOrderCompleteModalOpened &&
        !data.isCashPaymentInducementModalOpened
      );
    },
  };
});
