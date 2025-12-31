import { useRef, useCallback } from 'react';

export interface UseLongPressOptions {
  /**
   * 길게 누르기로 인식할 시간(ms)
   * @default 500
   */
  delay?: number;
  /**
   * 길게 누르기 발생 시 실행할 콜백
   */
  onLongPress?: (event: React.MouseEvent | React.TouchEvent) => void;
  /**
   * 일반 클릭 시 실행할 콜백
   */
  onClick?: (event: React.MouseEvent | React.TouchEvent) => void;
}

export interface UseLongPressHandlers {
  onMouseDown: (event: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onClick: (event: React.MouseEvent) => void;
  onTouchStart: (event: React.TouchEvent) => void;
  onTouchEnd: (event: React.TouchEvent) => void;
}

export interface UseLongPressReturn {
  /**
   * React 이벤트 핸들러 객체
   * 컴포넌트에 spread operator로 전달하여 사용
   */
  handlers: UseLongPressHandlers;
}

/**
 * 길게 누르기 이벤트를 처리하는 훅
 *
 * React 이벤트 핸들러를 반환하여 컴포넌트에 spread operator로 전달하여 사용합니다.
 *
 * @example
 * ```tsx
 * const { handlers } = useLongPress({
 *   delay: 500,
 *   onLongPress: () => console.log('길게 누름'),
 *   onClick: () => console.log('일반 클릭'),
 * });
 * <button {...handlers}>버튼</button>
 * ```
 */
export const useLongPress = (
  options: UseLongPressOptions = {}
): UseLongPressReturn => {
  const { delay, onLongPress, onClick } = options;

  // delay 기본값 500
  const handlersDelay = delay ?? (onLongPress ? 500 : undefined);

  // 타이머 ref
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 길게 누르기 상태
  const isLongPressRef = useRef(false);

  // 마우스/터치 시작: 타이머 시작하여 일정 시간 후 길게 누르기로 인식
  const handleLongPressStart = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      isLongPressRef.current = false; // 이전 상태 초기화

      if (handlersDelay !== undefined && onLongPress) {
        longPressTimerRef.current = setTimeout(() => {
          isLongPressRef.current = true;
          onLongPress(event); // 길게 누르기 콜백 실행
        }, handlersDelay);
      }
    },
    [handlersDelay, onLongPress]
  );

  // 마우스/터치 종료: 타이머 취소
  const handleLongPressEnd = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  // 클릭 처리: 길게 누르기가 아닌 경우에만 일반 클릭으로 인식
  const handleClick = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      handleLongPressEnd(); // 타이머 취소

      if (!isLongPressRef.current && onClick) {
        onClick(event); // 일반 클릭 콜백 실행
      }

      isLongPressRef.current = false; // 상태 초기화
    },
    [onClick, handleLongPressEnd]
  );

  // handlers 모드: React 컴포넌트에 spread로 전달할 이벤트 핸들러들
  const handlers: UseLongPressHandlers = {
    onMouseDown: (event: React.MouseEvent) => {
      handleLongPressStart(event);
    },
    onMouseUp: () => {
      handleLongPressEnd();
    },
    onMouseLeave: () => {
      handleLongPressEnd(); // 마우스가 벗어나면 타이머 취소
    },
    onClick: (event: React.MouseEvent) => {
      handleClick(event);
    },
    onTouchStart: (event: React.TouchEvent) => {
      handleLongPressStart(event);
    },
    onTouchEnd: (event: React.TouchEvent) => {
      handleClick(event);
    },
  };

  return { handlers };
};
