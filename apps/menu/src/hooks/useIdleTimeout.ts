import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * 사용자가 일정 시간 동안 동작이 없을 경우 콜백 함수를 실행하는 훅
 *
 * @param onTimeout - 타이머가 만료되었을 때 실행할 함수 (예: 팝업 닫기)
 * @param timeoutMs - 제한 시간 (기본값: 60000ms = 1분)
 */
export const useIdleTimeout = (
  onTimeout: () => void,
  timeoutMs: number = 60000
) => {
  const [isRunning, setIsRunning] = useState(false);
  const [remainingTime, setRemainingTime] = useState<number>(timeoutMs);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 타이머 시작 시간을 기록하여 남은 시간을 계산하기 위한 ref
  const startTimeRef = useRef<number>(0);

  // onTimeout 함수가 변경되더라도 이벤트 리스너를 다시 등록하지 않도록 최신 상태를 ref에 유지합니다.
  const savedCallback = useRef(onTimeout);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    savedCallback.current = onTimeout;
  }, [onTimeout]);

  // 타이머 리셋 함수
  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    startTimeRef.current = Date.now();
    setRemainingTime(timeoutMs);
    setIsRunning(true);

    timerRef.current = setTimeout(() => {
      setIsRunning(false);
      setRemainingTime(0);
      savedCallback.current();
    }, timeoutMs);
  }, [timeoutMs]);

  // 실시간으로 남은 시간을 계산하여 State를 갱신하는 Effect
  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = timeoutMs - elapsed;
      setRemainingTime(remaining > 0 ? remaining : 0);
    }, 1000); // 1초(1000ms) 단위로 갱신. 더 부드러운 UI가 필요하면 100 등으로 변경

    return () => clearInterval(intervalId);
  }, [isRunning, timeoutMs]);

  // 밀리초를 초 단위로 변환 (별도의 State 없이 렌더링 시점에 즉시 계산하여 최적화)
  const remainingSeconds = Math.ceil(remainingTime / 1000);

  // 수동으로 타이머와 이벤트를 정리하는 클리어 함수
  const clearTimer = useCallback(() => {
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null; // 중복 호출 방지
      setIsRunning(false);
    }
  }, []);

  // 수동으로 타이머와 이벤트를 등록(시작)하는 함수
  const startTimer = useCallback(() => {
    // 이미 등록된 이벤트가 있다면 중복 등록 방지
    if (cleanupRef.current) {
      return;
    }

    resetTimer();

    // 사용자 상호작용 이벤트 감지
    const handleActivity = () => {
      resetTimer();
    };

    // 감지할 이벤트 목록 (환경에 맞춰 추가/제거 가능)
    const events = [
      'touchstart',
      //'mousemove',
      //'mousedown',
      //'keydown',
      //'scroll',
      //'wheel',
    ];

    events.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // 클린업 로직을 ref에 저장하여 수동 클리어 함수에서 호출 가능하게 합니다.
    cleanupRef.current = () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [resetTimer]);

  useEffect(() => {
    // 마운트 시 자동 시작
    startTimer();

    // 언마운트 시 클린업
    return clearTimer;
  }, [startTimer, clearTimer]);

  return {
    startTimer,
    clearTimer,
    resetTimer,
    isRunning,
    remainingTime,
    remainingSeconds,
  };
};
