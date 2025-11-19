import styled from '@emotion/styled';
import { colors } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { css } from '@emotion/react';

export const Label = styled.label<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  padding: 14px 12px;
  box-sizing: border-box;
  transition: border-color 0.2s;
  height: 52px;

  border: 1px solid ${colors.grey[400]};
  ${({ disabled }) =>
    disabled &&
    css`
      background: ${colors.grey[100]};
      color: ${colors.grey[600]};
      border: 1px solid ${colors.grey[300]};
    `}
  &:focus-within {
    border: 1.5px solid ${colors.primary[400]};
  }
`;

export const InputWrapper = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
`;

export const StyledInput = styled.input<{
  $isPassword?: boolean;
  $hasRightSpace?: boolean;
}>`
  flex: 1;
  border: none;
  outline: none;
  padding-right: ${({ $hasRightSpace }) => ($hasRightSpace ? '1.5rem' : '0')};
  ${TYPOGRAPHY.ST_5};
  background: transparent;
  color: ${({ $isPassword }) =>
    $isPassword ? 'transparent' : colors.grey[700]};
  width: 100%;
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
    color: ${colors.grey[400]};
    ${TYPOGRAPHY.ST_5};
  }
`;

export const PasswordOverlay = styled.div<{ $hasRightSpace?: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: ${({ $hasRightSpace }) => ($hasRightSpace ? '1.5rem' : '0')};
  bottom: 0;
  display: flex;
  align-items: center;
  pointer-events: none;
  overflow: hidden;
  white-space: nowrap;
  ${TYPOGRAPHY.ST_5};
  line-height: inherit;
`;

export const PasswordDot = styled.span`
  font-size: 1.25rem;
  line-height: 1;
  color: ${colors.grey[700]};
  margin-right: 0.1rem;
  display: inline-block;
  vertical-align: middle;
`;

export const ClearButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1.5rem;
  color: ${colors.grey[500]};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const RightArea = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ErrorMessage = styled.p`
  color: ${colors.semantic[400]};
  ${TYPOGRAPHY.CT_2};
  margin-top: 12px;
  padding-left: 12px;
`;
