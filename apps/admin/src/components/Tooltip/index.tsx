import type { ReactNode, RefObject, Ref } from 'react';
import * as S from '@/components/Tooltip/tooltip.style';

interface TooltipProps {
  children: ReactNode;
  tooltipRef: RefObject<HTMLDivElement | null>;
}

export const Tooltip = ({ children, tooltipRef }: TooltipProps) => {
  return (
    <S.Tooltip ref={tooltipRef as Ref<HTMLDivElement>}>
      <S.TooltipText>{children}</S.TooltipText>
      <S.TooltipArrow data-arrow />
    </S.Tooltip>
  );
};
