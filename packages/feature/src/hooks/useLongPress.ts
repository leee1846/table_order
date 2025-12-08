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
  onLongPress: (event: MouseEvent | TouchEvent) => void;
  /**
   * 일반 클릭 시 실행할 콜백
   */
  onClick?: (event: MouseEvent | TouchEvent) => void;
  /**
   * 기본 동작 방지 여부
   * @default false
   */
  preventDefault?: boolean;
}

export interface UseLongPressReturn {
  onMouseDown: (event: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onClick: (event: React.MouseEvent) => void;
  onTouchStart: (event: React.TouchEvent) => void;
  onTouchEnd: (event: React.TouchEvent) => void;
}

/**
 * 길게 누르기 이벤트를 처리하는 훅
 *
 * @example
 * ```tsx
 * const longPressHandlers = useLongPress({
 *   delay: 500,
 *   onLongPress: () => console.log('길게 누름'),
 *   onClick: () => console.log('일반 클릭'),
 * });
 *
 * <button {...longPressHandlers}>버튼</button>
 * ```
 */
export const useLongPress = (
  options: UseLongPressOptions
): UseLongPressReturn => {
  const { delay = 500, onLongPress, onClick, preventDefault = false } = options;

  // 길게 누르기 타이머 ID를 저장하는 ref
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 길게 누르기가 발생했는지 추적하는 boolean 값
  const isLongPressRef = useRef(false);

  // 길게 누르기 시작 처리
  const handleLongPressStart = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (preventDefault) {
        event.preventDefault();
      }

      isLongPressRef.current = false; // 이전 길게 누르기 상태 초기화

      longPressTimerRef.current = setTimeout(() => {
        isLongPressRef.current = true;
        onLongPress(event);
      }, delay);
    },
    [delay, onLongPress, preventDefault]
  );

  // 길게 누르기 종료 처리
  const handleLongPressEnd = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  // 클릭 처리 (길게 누르기가 아닌 경우에만 onClick 실행)
  const handleClick = useCallback(
    (event: MouseEvent | TouchEvent) => {
      handleLongPressEnd();

      if (!isLongPressRef.current && onClick) {
        onClick(event);
      }

      isLongPressRef.current = false; // 상태 초기화
    },
    [onClick, handleLongPressEnd]
  );

  return {
    onMouseDown: (event: React.MouseEvent) => {
      handleLongPressStart(event.nativeEvent);
    },
    onMouseUp: () => {
      handleLongPressEnd();
    },
    onMouseLeave: () => {
      handleLongPressEnd();
    },
    onClick: (event: React.MouseEvent) => {
      handleClick(event.nativeEvent);
    },
    onTouchStart: (event: React.TouchEvent) => {
      handleLongPressStart(event.nativeEvent);
    },
    onTouchEnd: (event: React.TouchEvent) => {
      handleClick(event.nativeEvent);
    },
  };
};
