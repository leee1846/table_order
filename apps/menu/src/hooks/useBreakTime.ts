import { useState, useEffect } from 'react';
import { globalTimerManager } from '@/utils/timerManager';
import { TIMER_KEYS } from '@/constants/keys';
import { checkBreakTimeStatus } from '@/utils/breakTime';
import { useShopDetailData } from './useShopDetailData';

interface UseBreakTimeReturn {
  showBreakTime: boolean;
  isBreakTimeLastOrder: boolean;
  isBreakTimeLastOrderAlert: boolean;
  breakTimeMessage: string | null;
  breakTimeLastOrderMessage: string | null;
  breakTimeStartTime: string | null;
  breakTimeEndTime: string | null;
  lastOrderTime: string | null;
  lastOrderAlertTime: string | null;
}

/**
 * 브레이크타임 상태를 관리하는 커스텀 훅
 *
 * @returns 브레이크타임 상태 정보
 */
export const useBreakTime = (): UseBreakTimeReturn => {
  const { data: shopDetailData } = useShopDetailData();

  const [showBreakTime, setShowBreakTime] = useState(false);
  const [isBreakTimeLastOrder, setIsBreakTimeLastOrder] = useState(false);
  const [isBreakTimeLastOrderAlert, setIsBreakTimeLastOrderAlert] =
    useState(false);
  const [breakTimeMessage, setBreakTimeMessage] = useState<string | null>(null);
  const [breakTimeLastOrderMessage, setBreakTimeLastOrderMessage] = useState<
    string | null
  >(null);
  const [breakTimeStartTime, setBreakTimeStartTime] = useState<string | null>(
    null
  );
  const [breakTimeEndTime, setBreakTimeEndTime] = useState<string | null>(null);
  const [lastOrderTime, setLastOrderTime] = useState<string | null>(null);
  const [lastOrderAlertTime, setLastOrderAlertTime] = useState<string | null>(
    null
  );

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
      return;
    }

    /**
     * 브레이크타임 상태를 업데이트하는 함수
     */
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

      // 다음 상태 변경을 위한 타이머 설정 (재귀적으로 상태 업데이트)
      if (status.nextChangeMs !== null && status.nextChangeMs > 0) {
        globalTimerManager.setTimeout(
          TIMER_KEYS.BREAK_TIME_UPDATE,
          () => {
            updateBreakTimeStatus(); // 타이머가 끝나면 다시 상태 확인하여 다음 이벤트 대기
          },
          status.nextChangeMs
        );
      }
    };

    // 초기 상태 업데이트
    updateBreakTimeStatus();

    // cleanup: 데이터 변경 또는 언마운트 시 타이머 정리
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
  };
};
