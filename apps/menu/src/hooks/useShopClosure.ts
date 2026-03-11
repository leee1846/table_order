import { useState, useEffect } from 'react';
import { globalTimerManager } from '@/utils/timerManager';
import { TIMER_KEYS } from '@/constants/keys';
import { checkShopClosureStatus } from '@/utils/shopClosure';
import { useShopDetailStore } from '@/stores/useShopDetailStore';

export interface UseShopClosureReturn {
  showClosed: boolean;
  isClosureLastOrder: boolean;
  isClosureLastOrderAlert: boolean;
  closureMessage: string | null;
  closureLastOrderMessage: string | null;
  closureStartTime: string | null;
  closureEndTime: string | null;
  lastOrderTime: string | null;
  lastOrderAlertTime: string | null;
  showLastOrderAlertModal: boolean;
  closeLastOrderAlertModal: () => void;
}

/**
 * 영업마감 상태를 실시간으로 관리하는 커스텀 훅
 *
 * @description
 * - 매장의 영업마감 설정을 기반으로 현재 시간의 영업마감 상태를 감지합니다
 * - 다음 상태 변경 시점에 타이머를 설정하여 자동으로 상태를 업데이트합니다
 * - 라스트오더 시간 및 알림 시간을 감지하고 모달을 표시합니다
 *
 * @returns 영업마감 상태 정보 및 제어 함수
 */
export const useShopClosure = (): UseShopClosureReturn => {
  const { data: shopDetailData } = useShopDetailStore();

  const [showClosed, setShowClosed] = useState(false);
  const [isClosureLastOrder, setIsClosureLastOrder] = useState(false);
  const [isClosureLastOrderAlert, setIsClosureLastOrderAlert] = useState(false);
  const [closureMessage, setClosureMessage] = useState<string | null>(null);
  const [closureLastOrderMessage, setClosureLastOrderMessage] = useState<
    string | null
  >(null);
  const [closureStartTime, setClosureStartTime] = useState<string | null>(null);
  const [closureEndTime, setClosureEndTime] = useState<string | null>(null);
  const [lastOrderTime, setLastOrderTime] = useState<string | null>(null);
  const [lastOrderAlertTime, setLastOrderAlertTime] = useState<string | null>(
    null
  );
  const [showLastOrderAlertModal, setShowLastOrderAlertModal] = useState(false);

  useEffect(() => {
    const shopTime = shopDetailData?.shopTime;

    if (!shopTime) {
      setShowClosed(false);
      setIsClosureLastOrder(false);
      setIsClosureLastOrderAlert(false);
      setClosureMessage(null);
      setClosureLastOrderMessage(null);
      setClosureStartTime(null);
      setClosureEndTime(null);
      setLastOrderTime(null);
      setLastOrderAlertTime(null);
      setShowLastOrderAlertModal(false);
      return;
    }

    /**
     * 영업마감 상태를 업데이트하는 함수
     */
    const updateShopClosureStatus = () => {
      const status = checkShopClosureStatus(shopTime);

      setShowClosed(status.showClosed);
      setIsClosureLastOrder(status.isClosureLastOrder);
      setIsClosureLastOrderAlert(status.isClosureLastOrderAlert);
      setClosureMessage(status.closureMessage);
      setClosureLastOrderMessage(status.closureLastOrderMessage);
      setClosureStartTime(status.closureStartTime);
      setClosureEndTime(status.closureEndTime);
      setLastOrderTime(status.lastOrderTime);
      setLastOrderAlertTime(status.lastOrderAlertTime);
      setShowLastOrderAlertModal(status.isClosureLastOrderAlert);

      // 다음 상태 변경을 위한 타이머 설정 (재귀적으로 상태 업데이트)
      if (status.nextChangeMs !== null && status.nextChangeMs > 0) {
        globalTimerManager.setTimeout(
          TIMER_KEYS.SHOP_CLOSURE_UPDATE,
          () => {
            updateShopClosureStatus(); // 타이머가 끝나면 다시 상태 확인하여 다음 이벤트 대기
          },
          status.nextChangeMs
        );
      }
    };

    // 초기 상태 업데이트
    updateShopClosureStatus();

    // cleanup: 데이터 변경 또는 언마운트 시 타이머 정리
    return () => {
      globalTimerManager.clear(TIMER_KEYS.SHOP_CLOSURE_UPDATE);
    };
  }, [shopDetailData?.shopTime]);

  return {
    showClosed,
    isClosureLastOrder,
    isClosureLastOrderAlert,
    closureMessage,
    closureLastOrderMessage,
    closureStartTime,
    closureEndTime,
    lastOrderTime,
    lastOrderAlertTime,
    showLastOrderAlertModal,
    closeLastOrderAlertModal: () => setShowLastOrderAlertModal(false),
  };
};
