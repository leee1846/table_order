import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { theme } from '@repo/ui';

const { colors } = theme;

export const DraggableCard = styled.div<{
  isActive: boolean;
  isOver: boolean;
  isDragging: boolean;
  hasOrder: boolean;
  isOverTarget: boolean;
}>`
  position: relative;
  cursor: ${({ hasOrder }) => (hasOrder ? 'grab' : 'default')};
  touch-action: none;
  will-change: transform;
  width: 190px;
  height: 154px;
  overflow: hidden;
  user-select: none;

  ${({ isDragging }) =>
    isDragging &&
    css`
      cursor: grabbing;
      z-index: 5;
    `}

  ${({ isOver, isDragging }) =>
    isOver &&
    !isDragging &&
    css`
      & > div,
      & > div:active {
        background: ${colors.secondary[400]};
      }
    `}

  ${({ isOverTarget }) => isOverTarget && css``}

  ${({ isActive }) =>
    isActive &&
    css`
      & > div,
      & > div:active {
        background: ${colors.secondary[400]};
      }
    `}
`;

