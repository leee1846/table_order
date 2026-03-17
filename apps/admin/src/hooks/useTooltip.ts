import { useEffect, useRef, useState } from 'react';

/**
 * 툴팁 표시 및 위치 자동 조정 훅
 * - 콘텐츠 영역을 벗어나지 않도록 x축 위치 자동 조정
 * - 외부 클릭 시 자동 닫힘
 */
export const useTooltip = () => {
  const [isVisible, setIsVisible] = useState(false); //툴팁 표시, 숨김 상태
  const anchorRef = useRef<HTMLDivElement | null>(null); // 툴팁을 표시할 기준 요소
  const tooltipRef = useRef<HTMLDivElement | null>(null); // 툴팁 요소

  const toggle = () => setIsVisible((prev) => !prev);
  const close = () => setIsVisible(false);

  // 툴팁이 보일 때 위치 자동 조정
  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const adjustPosition = () => {
      const tooltip = tooltipRef.current;
      const anchor = anchorRef.current;
      if (!tooltip || !anchor) {
        return;
      }

      const arrow = tooltip.querySelector('[data-arrow]') as HTMLElement;
      if (!arrow) {
        return;
      }

      // 콘텐츠 영역(사이드바 제외) 찾기
      const container = tooltip.closest('[data-container]') as HTMLElement;
      if (!container) {
        return;
      }

      // 각 요소의 위치 정보 가져오기
      const tooltipRect = tooltip.getBoundingClientRect();
      const anchorRect = anchor.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      // 콘텐츠 영역을 벗어나는지 확인
      const overflowRight = tooltipRect.right - containerRect.right;
      const overflowLeft = containerRect.left - tooltipRect.left;

      // 벗어나는 만큼 반대 방향으로 이동 (여백 16px 추가)
      const shift =
        overflowRight > 0
          ? -(overflowRight + 16)
          : overflowLeft > 0
            ? overflowLeft + 16
            : 0;

      // 툴팁 위치 조정
      tooltip.style.transform = `translate(-50%, 0) translateX(${shift}px)`;

      // 화살표는 항상 anchor 중심을 가리키도록 위치 조정
      const anchorCenter = anchorRect.left + anchorRect.width / 2;
      const tooltipLeft = tooltipRect.left + shift;
      arrow.style.left = `${anchorCenter - tooltipLeft}px`;
    };

    setTimeout(adjustPosition, 0);
  }, [isVisible]);

  // 외부 클릭 시 툴팁 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isVisible &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        close();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);

  return {
    isVisible,
    anchorRef,
    tooltipRef,
    toggle,
    close,
  };
};
