import { useCallback, useLayoutEffect, useRef } from 'react';

const isEnter = (e: React.KeyboardEvent) => {
  return (
    e.key === 'Enter' &&
    !e.nativeEvent.defaultPrevented &&
    !e.nativeEvent.isComposing
  );
};

const shouldIgnoreEnterTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  if (target.closest('textarea') != null) {
    return true;
  }
  if (target.isContentEditable) {
    return true;
  }
  return false;
};

/**
 * 다이얼로그가 열릴 때 뒤쪽 포커스를 제거하고, Enter로 주 확인 동작을 실행합니다.
 */
export const useDialogConfirmEnter = (onConfirm?: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!onConfirm || !isEnter(e) || shouldIgnoreEnterTarget(e.target)) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      onConfirm();
    },
    [onConfirm]
  );

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) {
      return;
    }
    const active = document.activeElement;
    if (active instanceof HTMLElement && !root.contains(active)) {
      active.blur();
    }
    if (onConfirm) {
      root.focus({ preventScroll: true });
    }
  }, [onConfirm]);

  return {
    ref,
    rootKeyboardProps: {
      tabIndex: -1 as const,
      onKeyDown: handleKeyDown,
    },
  };
};
