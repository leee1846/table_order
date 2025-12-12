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
  border-radius: 12px;
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
      border: 2px solid ${colors.white};
      & > div {
        background: ${colors.secondary[400]};
      }
    `}

  ${({ isOverTarget }) =>
    isOverTarget &&
    css`
      border: 2px solid ${colors.white};
    `}

  ${({ isActive }) =>
    isActive &&
    css`
      & > div {
        background: ${colors.secondary[400]};
      }
    `}
`;
