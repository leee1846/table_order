import type { ReactNode, RefObject, Ref } from 'react';
import * as S from '@/components/Tooltip/tooltip.style';
import type { TooltipPlacement } from '@/components/Tooltip/tooltip.style';

interface TooltipProps {
  children: ReactNode;
  tooltipRef: RefObject<HTMLDivElement | null>;
  placement?: TooltipPlacement;
}

export const Tooltip = ({
  children,
  tooltipRef,
  placement = 'bottom',
}: TooltipProps) => {
  return (
    <S.Tooltip
      ref={tooltipRef as Ref<HTMLDivElement>}
      $placement={placement}
    >
      <S.TooltipText>{children}</S.TooltipText>
      <S.TooltipArrow data-arrow $placement={placement} />
    </S.Tooltip>
  );
};
