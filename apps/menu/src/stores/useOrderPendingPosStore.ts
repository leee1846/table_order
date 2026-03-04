import { create } from '@repo/feature/zustand';

type OrderCompleteSuccessCallback = () => void;
type OrderCompleteFailureCallback = () => void;

interface IOrderPendingPosStore {
  /** 현재 대기 중인 주문 그룹 UUID (ORDER_COMPLETE/POS_ERROR 수신 시 비교용) */
  pendingOrderGroupUuid: string | null;
  /** 로딩 스피너 유지 여부 (주문 API 성공 후 ORDER_COMPLETE 수신 전까지) */
  isWaitingForOrderComplete: boolean;
  /** ORDER_COMPLETE 수신 시 실행할 성공 콜백 */
  onOrderCompleteSuccess: OrderCompleteSuccessCallback | null;
  /** POS_ERROR 수신 시 실행할 실패 콜백 */
  onOrderCompleteFailure: OrderCompleteFailureCallback | null;

  /**
   * 주문 API 성공 후 ORDER_COMPLETE 대기 등록
   * @param orderGroupUuid - 현재 주문의 orderGroupUuid
   * @param onSuccess - ORDER_COMPLETE 수신 시 실행할 성공 처리
   * @param onFailure - POS_ERROR 수신 시 실행할 실패 처리 (다이얼로그 등)
   */
  setPendingOrder: (
    orderGroupUuid: string,
    onSuccess: OrderCompleteSuccessCallback,
    onFailure: OrderCompleteFailureCallback
  ) => void;

  /** 대기 상태 및 콜백 초기화 */
  clearPendingOrder: () => void;

  /** ORDER_COMPLETE 수신 시: 성공 콜백 실행 후 초기화 */
  completeWithSuccess: () => void;

  /** POS_ERROR 수신 시: 실패 콜백 실행 후 초기화 */
  completeWithFailure: () => void;
}

const initialState = {
  pendingOrderGroupUuid: null as string | null,
  isWaitingForOrderComplete: false,
  onOrderCompleteSuccess: null as OrderCompleteSuccessCallback | null,
  onOrderCompleteFailure: null as OrderCompleteFailureCallback | null,
};

export const useOrderPendingPosStore = create<IOrderPendingPosStore>((set, get) => ({
  ...initialState,

  setPendingOrder: (orderGroupUuid, onSuccess, onFailure) => {
    set({
      pendingOrderGroupUuid: orderGroupUuid,
      isWaitingForOrderComplete: true,
      onOrderCompleteSuccess: onSuccess,
      onOrderCompleteFailure: onFailure,
    });
  },

  clearPendingOrder: () => {
    set(initialState);
  },

  completeWithSuccess: () => {
    const { onOrderCompleteSuccess } = get();
    onOrderCompleteSuccess?.();
    set(initialState);
  },

  completeWithFailure: () => {
    const { onOrderCompleteFailure } = get();
    onOrderCompleteFailure?.();
    set(initialState);
  },
}));
