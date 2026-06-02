import styled from '@emotion/styled';
import { theme } from '@repo/ui';
import { css } from '@emotion/react';

export type VariantKey =
  | 'default'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'secondary';

const sizeStyles = {
  default: css`
    height: 36px;
    padding: 0 16px;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: -0.01em;
  `,
  icon: css`
    height: 32px;
    width: 32px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  `,
};

const getVariantStyles = (variant: VariantKey, disabled: boolean) => {
  const baseStyles = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: all 0.15s ease;
    white-space: nowrap;
    user-select: none;
    cursor: ${disabled ? 'not-allowed' : 'pointer'};
    border: 1px solid transparent;
  `;

  switch (variant) {
    case 'default':
      return css`
        ${baseStyles}
        background-color: ${disabled
          ? theme.colors.grey[200]
          : theme.colors.primary[600]};
        color: ${theme.colors.white};
        &:hover:not(:disabled) {
          background-color: ${theme.colors.primary[700]};
        }
        &:active:not(:disabled) {
          background-color: ${theme.colors.primary[800]};
        }
      `;
    case 'outline':
      return css`
        ${baseStyles}
        background-color: ${theme.colors.white};
        color: ${disabled ? theme.colors.grey[400] : theme.colors.grey[900]};
        border-color: ${disabled
          ? theme.colors.grey[300]
          : theme.colors.grey[300]};
        &:hover:not(:disabled) {
          background-color: ${theme.colors.grey[50]};
          border-color: ${theme.colors.grey[400]};
        }
        &:active:not(:disabled) {
          background-color: ${theme.colors.grey[100]};
        }
      `;
    case 'ghost':
      return css`
        ${baseStyles}
        background-color: transparent;
        color: ${disabled ? theme.colors.grey[400] : theme.colors.grey[900]};
        &:hover:not(:disabled) {
          background-color: ${theme.colors.grey[100]};
        }
        &:active:not(:disabled) {
          background-color: ${theme.colors.grey[200]};
        }
      `;
    case 'destructive':
      return css`
        ${baseStyles}
        background-color: ${disabled
          ? theme.colors.grey[200]
          : theme.colors.semantic[500]};
        color: ${theme.colors.white};
        &:hover:not(:disabled) {
          background-color: ${theme.colors.semantic[600]};
        }
        &:active:not(:disabled) {
          background-color: ${theme.colors.semantic[700]};
        }
      `;
    case 'secondary':
      return css`
        ${baseStyles}
        background-color: ${disabled
          ? theme.colors.grey[200]
          : theme.colors.grey[100]};
        color: ${disabled ? theme.colors.grey[400] : theme.colors.grey[900]};
        &:hover:not(:disabled) {
          background-color: ${theme.colors.grey[200]};
        }
        &:active:not(:disabled) {
          background-color: ${theme.colors.grey[300]};
        }
      `;
    default:
      return baseStyles;
  }
};

export const ButtonStyle = styled.button<{
  variant: VariantKey;
  disabled: boolean;
  fullWidth?: boolean;
  size?: 'default' | 'icon';
}>`
  ${({ variant, disabled }) => getVariantStyles(variant, disabled)}
  ${({ size = 'default' }) => sizeStyles[size]}
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  &:focus-visible {
    outline: 2px solid ${theme.colors.primary[500]};
    outline-offset: 2px;
  }
`;
