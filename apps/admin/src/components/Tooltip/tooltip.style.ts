import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export type TooltipPlacement = 'top' | 'bottom';

export const Tooltip = styled.div<{ $placement: TooltipPlacement }>`
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 9999;
  background-color: ${theme.colors.grey[800]};
  color: ${theme.colors.white};
  padding: 8px 12px;
  border-radius: 8px;
  white-space: nowrap;
  ${TYPOGRAPHY.ST_4}
  pointer-events: none;

  ${({ $placement }) =>
    $placement === 'top'
      ? css`
          bottom: calc(100% + 8px);
          top: auto;
        `
      : css`
          top: calc(100% + 8px);
          bottom: auto;
        `}
`;

export const TooltipText = styled.span`
  display: block;
`;

export const TooltipArrow = styled.div<{ $placement: TooltipPlacement }>`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;

  ${({ $placement }) =>
    $placement === 'top'
      ? css`
          bottom: -5px;
          top: auto;
          border-top: 6px solid ${theme.colors.grey[800]};
          border-bottom: none;
        `
      : css`
          top: -5px;
          bottom: auto;
          border-bottom: 6px solid ${theme.colors.grey[800]};
          border-top: none;
        `}
`;
