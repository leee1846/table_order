import { useState, useEffect } from 'react';
import { globalTimerManager } from '@/utils/timerManager';
import { TIMER_KEYS } from '@/constants/keys';
import { checkBreakTimeStatus } from '@/utils/breakTime';
import { useShopDetailStore } from '@/stores/useShopDetailStore';

export interface UseBreakTimeReturn {
  /** 브레이크타임 화면 표시 여부 */
  showBreakTime: boolean;
  /** 라스트오더 시간 여부 (브레이크타임 시작 전 마지막 주문 가능 시간) */
  isBreakTimeLastOrder: boolean;
  /** 라스트오더 알림 시간 여부 (라스트오더 시작 전 알림 표시 시간) */
  isBreakTimeLastOrderAlert: boolean;
  /** 브레이크타임 중 표시할 메시지 */
  breakTimeMessage: string | null;
  /** 라스트오더 시간에 표시할 메시지 */
  breakTimeLastOrderMessage: string | null;
  /** 브레이크타임 시작 시간 (hh:mm 형식) */
  breakTimeStartTime: string | null;
  /** 브레이크타임 종료 시간 (hh:mm 형식) */
  breakTimeEndTime: string | null;
  /** 라스트오더 시간 (hh:mm 형식) */
  lastOrderTime: string | null;
  /** 라스트오더 알림 시간 (hh:mm 형식) */
  lastOrderAlertTime: string | null;
  /** 라스트오더 알림 모달 표시 여부 */
  showLastOrderAlertModal: boolean;
  /** 라스트오더 알림 모달 닫기 함수 */
  closeLastOrderAlertModal: () => void;
}

/**
 * 브레이크타임 상태를 실시간으로 관리하는 커스텀 훅
 *
 * @description
 * - 매장의 브레이크타임 설정을 기반으로 현재 시간의 브레이크타임 상태를 감지합니다
 * - 다음 상태 변경 시점에 타이머를 설정하여 자동으로 상태를 업데이트합니다
 * - 라스트오더 시간 및 알림 시간을 감지하고 모달을 표시합니다
 *
 * @returns 브레이크타임 상태 정보 및 제어 함수
 */
export const useBreakTime = (): UseBreakTimeReturn => {
  const { data: shopDetailData } = useShopDetailStore();

  // 브레이크타임 화면 표시 여부
  const [showBreakTime, setShowBreakTime] = useState(false);
  // 라스트오더 시간 여부 (브레이크타임 시작 전 마지막 주문 가능 시간)
  const [isBreakTimeLastOrder, setIsBreakTimeLastOrder] = useState(false);
  // 라스트오더 알림 시간 여부 (라스트오더 시작 전 알림 표시 시간)
  const [isBreakTimeLastOrderAlert, setIsBreakTimeLastOrderAlert] =
    useState(false);
  // 브레이크타임 중 표시할 메시지
  const [breakTimeMessage, setBreakTimeMessage] = useState<string | null>(null);
  // 라스트오더 시간에 표시할 메시지
  const [breakTimeLastOrderMessage, setBreakTimeLastOrderMessage] = useState<
    string | null
  >(null);
  // 브레이크타임 시작 시간 (hh:mm 형식)
  const [breakTimeStartTime, setBreakTimeStartTime] = useState<string | null>(
    null
  );
  // 브레이크타임 종료 시간 (hh:mm 형식)
  const [breakTimeEndTime, setBreakTimeEndTime] = useState<string | null>(null);
  // 라스트오더 시간 (hh:mm 형식)
  const [lastOrderTime, setLastOrderTime] = useState<string | null>(null);
  // 라스트오더 알림 시간 (hh:mm 형식)
  const [lastOrderAlertTime, setLastOrderAlertTime] = useState<string | null>(
    null
  );
  // 라스트오더 알림 모달 표시 여부
  const [showLastOrderAlertModal, setShowLastOrderAlertModal] = useState(false);

  useEffect(() => {
    const shopTime = shopDetailData?.shopTime;
    if (!shopTime) {
      setShowBreakTime(false);
      setIsBreakTimeLastOrder(false);
      setIsBreakTimeLastOrderAlert(false);
      setBreakTimeMessage(null);
      setBreakTimeLastOrderMessage(null);
      setBreakTimeStartTime(null);
      setBreakTimeEndTime(null);
      setLastOrderTime(null);
      setLastOrderAlertTime(null);
      setShowLastOrderAlertModal(false);
      return;
    }

    const updateBreakTimeStatus = () => {
      const status = checkBreakTimeStatus(shopTime);

      setShowBreakTime(status.showBreakTime);
      setIsBreakTimeLastOrder(status.isBreakTimeLastOrder);
      setIsBreakTimeLastOrderAlert(status.isBreakTimeLastOrderAlert);
      setBreakTimeMessage(status.breakTimeMessage);
      setBreakTimeLastOrderMessage(status.breakTimeLastOrderMessage);
      setBreakTimeStartTime(status.breakTimeStartTime);
      setBreakTimeEndTime(status.breakTimeEndTime);
      setLastOrderTime(status.lastOrderTime);
      setLastOrderAlertTime(status.lastOrderAlertTime);
      setShowLastOrderAlertModal(status.isBreakTimeLastOrderAlert);

      // 다음 상태 변경 시점에 자동으로 재확인하기 위한 타이머 설정
      // 예: 라스트오더 알림 → 라스트오더 → 브레이크타임 → 종료
      if (status.nextChangeMs !== null && status.nextChangeMs > 0) {
        globalTimerManager.setTimeout(
          TIMER_KEYS.BREAK_TIME_UPDATE,
          () => {
            // 타이머가 만료되면 다시 상태를 확인하여 다음 이벤트 대기
            // 이렇게 재귀적으로 호출하여 연속적인 상태 변화를 처리
            updateBreakTimeStatus();
          },
          status.nextChangeMs
        );
      }
    };

    // 초기 상태 업데이트 (컴포넌트 마운트 또는 shopTime 변경 시)
    updateBreakTimeStatus();

    // cleanup: shopTime 변경 또는 컴포넌트 언마운트 시 타이머 정리
    return () => {
      globalTimerManager.clear(TIMER_KEYS.BREAK_TIME_UPDATE);
    };
  }, [shopDetailData?.shopTime]);

  return {
    showBreakTime,
    isBreakTimeLastOrder,
    isBreakTimeLastOrderAlert,
    breakTimeMessage,
    breakTimeLastOrderMessage,
    breakTimeStartTime,
    breakTimeEndTime,
    lastOrderTime,
    lastOrderAlertTime,
    showLastOrderAlertModal,
    /** 라스트오더 알림 모달을 닫는 함수 */
    closeLastOrderAlertModal: () => setShowLastOrderAlertModal(false),
  };
};
