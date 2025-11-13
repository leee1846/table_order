import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { colors } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { zIndex } from '../../theme/zIndex';

export const Container = styled.div`
  position: relative;
  width: '100%';
`;

export const Trigger = styled.button<{ disabled?: boolean; isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  padding: 10px 14px;
  border: 1px solid ${colors.grey[400]};
  border-radius: 0.75rem;
  background-color: ${colors.white};
  color: ${colors.grey[600]};
  cursor: pointer;
  ${TYPOGRAPHY.BD_2};

  ${({ disabled }) =>
    disabled &&
    css`
      color: ${colors.grey[400]};
      cursor: not-allowed;
    `}

  & > svg {
    transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  }
`;

export const List = styled.ul<{
  position?: 'left' | 'right';
  direction?: 'up' | 'down';
}>`
  position: absolute;
  ${({ direction }) =>
    direction === 'up'
      ? css`
          bottom: calc(100% + 4px);
          top: auto;
        `
      : css`
          top: calc(100% + 4px);
          bottom: auto;
        `}
  ${({ position }) =>
    position === 'left'
      ? css`
          left: 0;
          right: auto;
        `
      : css`
          left: auto;
          right: 0;
        `}
  padding: 10px 12px;
  border: 1px solid ${colors.grey[400]};
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04);
  background-color: ${colors.white};
  border-radius: 0.75rem;
  z-index: ${zIndex.dropdown};
  max-height: 246px;
  min-width: 124px;
  overflow-y: auto;

  & > li:last-child {
    border-bottom: none;
  }
`;

export const Option = styled.li<{
  isSelected?: boolean;
}>`
  padding: 10px 0;
  cursor: pointer;
  ${TYPOGRAPHY.ST_4};
  color: ${colors.grey[600]};
  border-bottom: 1px solid ${colors.grey[300]};
  text-align: center;
  white-space: nowrap;

  ${({ isSelected }) =>
    isSelected &&
    css`
      color: ${colors.grey[700]};
      ${TYPOGRAPHY.ST_3};
    `}
`;
