import styled from '@emotion/styled';
import { theme } from '@repo/ui';
import { css } from '@emotion/react';

export const InputContainer = styled.div<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  height: 36px;
  padding: 0 12px;
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.grey[300]};
  border-radius: 6px;
  transition: all 0.15s ease;
  box-sizing: border-box;

  ${({ disabled }) =>
    disabled &&
    css`
      background-color: ${theme.colors.grey[50]};
      cursor: not-allowed;
      opacity: 0.6;
    `}

  &:focus-within {
    border-color: ${theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${theme.colors.primary[100]};
    outline: none;
  }

  ${({ disabled }) =>
    !disabled &&
    css`
      &:hover {
        border-color: ${theme.colors.grey[400]};
      }
    `}
`;

export const InputWrapper = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 0;
`;

export const StyledInput = styled.input<{
  $isPassword?: boolean;
  $hasRightSpace?: boolean;
}>`
  flex: 1;
  border: none;
  outline: none;
  padding: 0;
  padding-right: ${({ $hasRightSpace }) => ($hasRightSpace ? '8px' : '0')};
  background: transparent;
  color: ${({ $isPassword }) =>
    $isPassword ? 'transparent' : theme.colors.grey[900]};
  width: 100%;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: -0.01em;

  ${({ $isPassword }) =>
    $isPassword &&
    css`
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      &::selection {
        background: transparent;
      }
      &::-moz-selection {
        background: transparent;
      }
    `}

  &::placeholder {
    color: ${theme.colors.grey[400]};
    font-size: 14px;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

export const PasswordOverlay = styled.div<{ $hasRightSpace?: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: ${({ $hasRightSpace }) => ($hasRightSpace ? '32px' : '0')};
  bottom: 0;
  display: flex;
  align-items: center;
  pointer-events: none;
  overflow: hidden;
  white-space: nowrap;
  font-size: 14px;
  line-height: 1.5;
`;

export const PasswordDot = styled.span`
  font-size: 12px;
  line-height: 1;
  color: ${theme.colors.grey[900]};
  margin-right: 2px;
  display: inline-block;
  vertical-align: middle;
`;

export const ClearButton = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  color: ${theme.colors.grey[400]};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 20px;
  height: 20px;
  transition: color 0.15s ease;

  &:hover {
    color: ${theme.colors.grey[600]};
  }
`;

export const RightArea = styled.div`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

export const ErrorMessage = styled.p`
  color: ${theme.colors.semantic[500]};
  font-size: 12px;
  font-weight: 400;
  line-height: 1.4;
  margin-top: 6px;
  padding-left: 0;
`;
