import { useRef, useCallback } from 'react';
import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core';

export interface UseLongPressOptions {
  /**
   * 길게 누르기로 인식할 시간(ms)
   * @default 500 (handlers 모드) 또는 350 (sensors 모드)
   */
  delay?: number;
  /**
   * 길게 누르기 발생 시 실행할 콜백 (handlers 모드에서 사용)
   */
  onLongPress?: (event: React.MouseEvent | React.TouchEvent) => void;
  /**
   * 일반 클릭 시 실행할 콜백 (handlers 모드에서 사용)
   */
  onClick?: (event: React.MouseEvent | React.TouchEvent) => void;
  /**
   * 기본 동작 방지 여부 (handlers 모드에서 사용)
   * @default false
   */
  preventDefault?: boolean;
  /**
   * 길게 누르는 동안 허용할 커서 이동 범위(px) (sensors 모드에서 사용)
   * @default 8
   */
  tolerance?: number;
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
   * React 이벤트 핸들러 객체 (handlers 모드)
   * 컴포넌트에 spread operator로 전달하여 사용
   */
  handlers: UseLongPressHandlers;
  /**
   * dnd-kit sensors (sensors 모드)
   * DndContext의 sensors prop에 전달하여 사용
   */
  sensors: ReturnType<typeof useSensors>;
}

/**
 * 길게 누르기 이벤트를 처리하는 통합 훅
 *
 * 두 가지 모드를 지원합니다:
 * 1. handlers 모드: React 이벤트 핸들러를 반환 (일반 컴포넌트에 사용)
 * 2. sensors 모드: dnd-kit sensors를 반환 (DndContext에 사용)
 *
 * @example
 * ```tsx
 * // handlers 모드 사용
 * const { handlers } = useLongPress({
 *   delay: 500,
 *   onLongPress: () => console.log('길게 누름'),
 *   onClick: () => console.log('일반 클릭'),
 * });
 * <button {...handlers}>버튼</button>
 *
 * // sensors 모드 사용
 * const { sensors } = useLongPress({ delay: 350, tolerance: 8 });
 * <DndContext sensors={sensors}>...</DndContext>
 * ```
 */
export const useLongPress = (
  options: UseLongPressOptions = {}
): UseLongPressReturn => {
  const {
    delay,
    onLongPress,
    onClick,
    preventDefault = false,
    tolerance = 8,
  } = options;

  // handlers 모드를 위한 delay (기본값 500)
  const handlersDelay = delay ?? (onLongPress ? 500 : undefined);
  // sensors 모드를 위한 delay (기본값 350)
  const sensorsDelay = delay ?? 350;

  // 타이머 ref
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 길게 누르기 상태
  const isLongPressRef = useRef(false);

  // 마우스/터치 시작: 타이머 시작하여 일정 시간 후 길게 누르기로 인식
  const handleLongPressStart = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (preventDefault) {
        event.preventDefault();
      }

      isLongPressRef.current = false; // 이전 상태 초기화

      if (handlersDelay !== undefined && onLongPress) {
        longPressTimerRef.current = setTimeout(() => {
          isLongPressRef.current = true;
          onLongPress(event); // 길게 누르기 콜백 실행
        }, handlersDelay);
      }
    },
    [handlersDelay, onLongPress, preventDefault]
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

  // sensors 모드: dnd-kit의 드래그 앤 드롭에 사용 (길게 누른 후 드래그 가능)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: sensorsDelay, // 이 시간 이상 누르고 있어야 드래그 시작
        tolerance, // 드래그 시작 전 허용되는 커서 이동 범위
      },
    })
  );

  return { handlers, sensors };
};
