import { useState, useEffect } from 'react';
import { globalTimerManager } from '@/utils/timerManager';
import { TIMER_KEYS } from '@/constants/keys';
import { checkBreakTimeStatus } from '@/utils/breakTime';
import { useShopDetailData } from './useShopDetailData';

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
 * 브레이크타임 상태를 관리하는 커스텀 훅
 *
 * @description
 * 이 훅은 매장의 브레이크타임 설정을 기반으로 현재 시간의 브레이크타임 상태를 실시간으로 관리합니다.
 * 다음과 같은 주요 기능을 제공합니다:
 *
 * ## 주요 기능
 *
 * 1. **브레이크타임 상태 실시간 감지**
 *    - 현재 시간이 브레이크타임 중인지 확인
 *    - 라스트오더 시간 및 알림 시간 감지
 *
 * 2. **자동 상태 업데이트**
 *    - `checkBreakTimeStatus` 함수를 통해 현재 상태 확인
 *    - 다음 상태 변경 시점(`nextChangeMs`)에 타이머를 설정하여 자동 업데이트
 *    - 재귀적으로 상태를 확인하여 연속적인 상태 변화 처리
 *
 * 3. **브레이크타임 정보 제공**
 *    - 브레이크타임 시작/종료 시간
 *    - 라스트오더 시간 및 알림 시간
 *    - 각 상태별 메시지
 *
 * 4. **라스트오더 알림 모달 관리**
 *    - 라스트오더 알림 시간에 자동으로 모달 표시
 *    - 사용자가 모달을 닫을 수 있는 함수 제공
 */
export const useBreakTime = (): UseBreakTimeReturn => {
  const { data: shopDetailData } = useShopDetailData();

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
