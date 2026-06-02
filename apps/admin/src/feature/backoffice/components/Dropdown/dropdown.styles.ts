import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { theme } from '@repo/ui';

export const Container = styled.div`
  position: relative;
  width: 100%;
`;

export const Trigger = styled.button<{ disabled?: boolean; isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  height: 36px;
  padding: 0 12px;
  border: 1px solid ${theme.colors.grey[300]};
  border-radius: 6px;
  background-color: ${theme.colors.white};
  color: ${theme.colors.grey[900]};
  cursor: pointer;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: -0.01em;
  transition: all 0.15s ease;
  box-sizing: border-box;

  &:hover:not(:disabled) {
    border-color: ${theme.colors.grey[400]};
  }

  &:focus {
    border-color: ${theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${theme.colors.primary[100]};
    outline: none;
  }

  ${({ disabled }) =>
    disabled &&
    css`
      color: ${theme.colors.grey[400]};
      cursor: not-allowed;
      background-color: ${theme.colors.grey[50]};
    `}

  & > svg {
    flex-shrink: 0;
    transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
    transition: transform 0.15s ease;
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

  width: 100%;
  padding: 4px;
  border: 1px solid ${theme.colors.grey[200]};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.08);
  background-color: ${theme.colors.white};
  border-radius: 6px;
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  margin: 0;
  list-style: none;
`;

export const Option = styled.li<{
  isSelected?: boolean;
  disabled?: boolean;
}>`
  padding: 8px 12px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  font-size: 14px;
  font-weight: ${({ isSelected }) => (isSelected ? 500 : 400)};
  color: ${({ disabled, isSelected }) =>
    disabled
      ? theme.colors.grey[400]
      : isSelected
        ? theme.colors.grey[900]
        : theme.colors.grey[700]};
  letter-spacing: -0.005em;
  line-height: 1.5;
  border-radius: 4px;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ disabled }) =>
      disabled ? 'transparent' : theme.colors.grey[50]};
  }

  &:active {
    background-color: ${({ disabled }) =>
      disabled ? 'transparent' : theme.colors.grey[100]};
  }
`;
