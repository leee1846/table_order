import { useEffect, useRef, type RefObject } from 'react';

const POINTER_DOWN_OPTIONS = { capture: true } as const;

/**
 * anchor 바깥에서 포인터가 눌리면 onDismiss를 호출합니다.
 * capture 단계를 쓰므로 자식의 touchEnd에서 preventDefault 해도 바깥 탭을 감지할 수 있습니다.
 */
export const useOutsidePointerDismiss = ({
  isActive,
  anchorRef,
  onDismiss,
}: {
  isActive: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  onDismiss: () => void;
}) => {
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const anchor = anchorRef.current;
      if (!anchor) {
        return;
      }
      if (!anchor.contains(event.target as Node)) {
        onDismissRef.current();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown, POINTER_DOWN_OPTIONS);
    return () => {
      document.removeEventListener(
        'pointerdown',
        handlePointerDown,
        POINTER_DOWN_OPTIONS
      );
    };
  }, [isActive, anchorRef]);
};
