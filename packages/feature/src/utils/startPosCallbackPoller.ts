import { getOrderPosCallbackCheck } from '@repo/api/fetchers';

interface IPosCallbackPollerOptions {
  shopCode: string;
  orderUuid: string;
  onSuccess: () => void;
  onFailure: () => void;
  /** 최대 횟수 초과 시 호출. 미전달 시 onFailure로 폴백 */
  onTimeout?: () => void;
}

const POS_CALLBACK_CODE = {
  SUCCESS: -601,
  PENDING: -602,
  FAILURE: -603,
} as const;

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_COUNT = 30;

/**
 * POS 주문 콜백 상태를 폴링하는 유틸 함수
 *
 * @description
 * - 3초마다 POS 콜백 상태를 확인합니다 (setTimeout 기반 재귀)
 * - 최대 30회까지 요청하며, 초과 시 onTimeout 호출 후 종료 (미전달 시 onFailure로 폴백)
 * - -601: 주문 성공 → onSuccess 호출 후 종료
 * - -602: 대기 중 → 3초 후 재시도 (최대 횟수 초과 시 onTimeout)
 * - -603 또는 API 에러: 주문 실패 → onFailure 호출 후 종료
 * - stop() 호출 시 즉시 중단
 */
export const startPosCallbackPoller = (
  options: IPosCallbackPollerOptions
): { stop: () => void } => {
  const { shopCode, orderUuid, onSuccess, onFailure, onTimeout } = options;
  let stopped = false;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let pollCount = 0;

  const poll = async () => {
    if (stopped) {
      return;
    }

    pollCount += 1;

    try {
      const result = await getOrderPosCallbackCheck(shopCode, orderUuid);
      if (stopped) {
        return;
      }

      const code = result.status.code;

      if (code === POS_CALLBACK_CODE.SUCCESS) {
        onSuccess();
        return;
      }

      if (code === POS_CALLBACK_CODE.FAILURE) {
        onFailure();
        return;
      }

      // -602: 대기 중 → 최대 횟수 초과 시 타임아웃 처리, 아니면 재시도
      if (pollCount >= MAX_POLL_COUNT) {
        (onTimeout ?? onFailure)();
        return;
      }

      timeoutId = setTimeout(poll, POLL_INTERVAL_MS);
    } catch {
      if (stopped) {
        return;
      }
      onFailure();
    }
  };

  poll();

  return {
    stop: () => {
      stopped = true;
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    },
  };
};
