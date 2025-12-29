import { create } from '@repo/feature/zustand';

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
    /** 카드 결제 진행 모달 */
    isCardPaymentProgressModalOpened: boolean;
  };

  setModalData: (dataKey: keyof IModalStore['data'], value: boolean) => void;

  /** 메뉴 상세 모달 열기 */
  openMenuDetail: (menuSeq: number) => void;

  /** 메뉴 상세 모달 닫기 */
  closeMenuDetail: () => void;

  /** 모든 모달 닫기 */
  closeAllModals: () => void;
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
  isCardPaymentProgressModalOpened: false,
};

/**
 * 모달 상태를 중앙에서 관리하는 스토어
 */
export const useModalStore = create<IModalStore>((set) => ({
  // 초기 상태
  data: initialData,

  setModalData: (dataKey: keyof IModalStore['data'], value: boolean) =>
    set((state) => ({ data: { ...state.data, [dataKey]: value } })),

  // 메뉴 상세 모달 열기
  openMenuDetail: (menuSeq: number) =>
    set((state) => ({ data: { ...state.data, openedMenuDetailSeq: menuSeq } })),

  // 메뉴 상세 모달 닫기
  closeMenuDetail: () =>
    set((state) => ({ data: { ...state.data, openedMenuDetailSeq: null } })),

  // 모든 모달 닫기
  closeAllModals: () =>
    set({
      data: initialData,
    }),
}));
