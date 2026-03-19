import { useEffect, useRef } from 'react';

const SCROLL_POSITION_KEY = 'SCROLL_POSITION';

export interface UseScrollToSelectedItemOptions {
  /**
   * 데이터 목록이 로드되었는지 여부
   */
  isDataLoaded: boolean;
}

export interface UseScrollToSelectedItemReturn {
  /**
   * 스크롤 컨테이너에 연결할 ref 콜백 함수
   */
  containerRef: (el: HTMLElement | null) => void;
}

/**
 * 스크롤 위치를 자동으로 저장하고 복원하는 훅
 *
 * 페이지 로드 시 1회만 이전 스크롤 위치를 복원하고,
 * 이후 사용자의 수동 스크롤 동작을 자동으로 저장합니다.
 *
 * @example
 * ```tsx
 * const { containerRef } = useScrollToSelectedItem({
 *   isDataLoaded: !!data,
 * });
 *
 * return (
 *   <div ref={containerRef}>
 *     {items.map((item) => (
 *       <button key={item.id}>{item.name}</button>
 *     ))}
 *   </div>
 * );
 * ```
 */
export const useScrollToSelectedItem = ({
  isDataLoaded,
}: UseScrollToSelectedItemOptions): UseScrollToSelectedItemReturn => {
  const containerElement = useRef<HTMLElement | null>(null);
  const hasScrolledToSelected = useRef(false);

  // 페이지 마운트 시 스크롤 위치 복원 (1회만)
  useEffect(() => {
    if (
      hasScrolledToSelected.current ||
      !isDataLoaded ||
      !containerElement.current
    ) {
      return;
    }

    const savedPosition = sessionStorage.getItem(SCROLL_POSITION_KEY);

    if (savedPosition !== null) {
      containerElement.current.scrollLeft = Number(savedPosition);
      hasScrolledToSelected.current = true;
    }
  }, [isDataLoaded]);

  const containerRef = (el: HTMLElement | null) => {
    // 이전 컨테이너에서 이벤트 리스너 제거
    if (containerElement.current) {
      containerElement.current.removeEventListener(
        'scrollend',
        handleScrollEnd
      );
    }

    containerElement.current = el;

    // 새 컨테이너에 이벤트 리스너 등록
    if (el) {
      el.addEventListener('scrollend', handleScrollEnd);
    }
  };

  const handleScrollEnd = () => {
    if (containerElement.current) {
      sessionStorage.setItem(
        SCROLL_POSITION_KEY,
        String(containerElement.current.scrollLeft)
      );
    }
  };

  return { containerRef };
};
