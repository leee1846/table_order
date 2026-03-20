import { create } from 'zustand';
import { startPosCallbackPoller } from '../utils/startPosCallbackPoller';

type Callback = () => void | Promise<void>;

interface PendingEntry {
  onSuccess: Callback;
  onFailure: Callback;
  /** 미전달 시 onFailure로 폴백 */
  onTimeout?: Callback;
  stopPoller: Callback;
}

interface IPosOrderStore {
  /** POS 주문 접수 완료 대기 중 여부 (로딩 스피너 표시용) */
  isWaitingForPosOrderComplete: boolean;

  /**
   * POS 주문 등록: 폴러를 시작하고 ORDER_COMPLETE 대기 상태로 전환
   * @param orderUuid - 주문 UUID
   * @param shopCode - 매장 코드
   * @param onSuccess - 성공 처리 콜백 (ORDER_COMPLETE SSE 또는 폴링 -601)
   * @param onFailure - 실패 처리 콜백 (폴링 -603 또는 에러)
   * @param onTimeout - 최대 횟수 초과 시 콜백. 미전달 시 onFailure로 폴백
   */
  register: (
    orderUuid: string,
    shopCode: string,
    onSuccess: Callback,
    onFailure: Callback,
    onTimeout?: Callback
  ) => void;

  /**
   * SSE ORDER_COMPLETE 수신 시 호출
   * 해당 주문을 성공 처리하고 폴러를 중단
   */
  handleOrderComplete: (orderUuid: string) => void;

  /**
   * 강제 정리 (로그아웃 등)
   * 폴러를 중단하고 상태를 초기화 (콜백 미실행)
   */
  clearAll: () => void;
}

export const usePosOrderStore = create<IPosOrderStore>((set) => {
  const pendingOrders = new Map<string, PendingEntry>();

  const resolveOrder = async (
    orderUuid: string,
    type: 'success' | 'failure' | 'timeout'
  ) => {
    const entry = pendingOrders.get(orderUuid);
    if (!entry) {
      return;
    }
    entry.stopPoller();
    pendingOrders.delete(orderUuid);

    if (type === 'success') {
      // 성공: 콜백(refreshTableOrderHistoriesData 포함) 완전히 끝난 뒤 대기 상태 해제
      await entry.onSuccess();
      set({ isWaitingForPosOrderComplete: pendingOrders.size > 0 });
    } else {
      // 실패/타임아웃: 콜백(cancelOrderMenu 등 비동기 포함) 완전히 끝난 뒤 대기 상태 해제
      const callback =
        type === 'timeout'
          ? (entry.onTimeout ?? entry.onFailure)
          : entry.onFailure;
      await callback();
      set({ isWaitingForPosOrderComplete: pendingOrders.size > 0 });
    }
  };

  return {
    isWaitingForPosOrderComplete: false,

    register: (orderUuid, shopCode, onSuccess, onFailure, onTimeout) => {
      // 동일 orderUuid가 이미 등록된 경우 기존 폴러 중단 후 재등록
      pendingOrders.get(orderUuid)?.stopPoller();

      const { stop } = startPosCallbackPoller({
        shopCode,
        orderUuid,
        onSuccess: () => resolveOrder(orderUuid, 'success'),
        onFailure: () => resolveOrder(orderUuid, 'failure'),
        onTimeout: onTimeout
          ? () => resolveOrder(orderUuid, 'timeout')
          : undefined,
      });

      pendingOrders.set(orderUuid, {
        onSuccess,
        onFailure,
        onTimeout,
        stopPoller: stop,
      });
      set({ isWaitingForPosOrderComplete: true });
    },

    handleOrderComplete: (orderUuid) => {
      resolveOrder(orderUuid, 'success');
    },

    clearAll: () => {
      pendingOrders.forEach((entry) => entry.stopPoller());
      pendingOrders.clear();
      set({ isWaitingForPosOrderComplete: false });
    },
  };
});
