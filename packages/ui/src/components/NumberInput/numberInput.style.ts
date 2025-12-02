import styled from '@emotion/styled';
import { colors } from '../../theme/colors';
import { TVariant } from '.';
import { TYPOGRAPHY } from '../../theme/typography';
import { baseTheme, Theme } from '../../index';

interface Props {
  variant: TVariant;
  size: 'L' | 'M';
  disabled: boolean;
  value: number;
}

const getBorderRadius = (variant: TVariant): string => {
  const BORDER_RADIUS: Record<TVariant, string> = {
    square: '0.75rem',
    rounded: '62.4rem',
  };
  return BORDER_RADIUS[variant];
};

const getWidth = (size: 'L' | 'M'): string => {
  return size === 'L' ? '11.25rem' : '8.125rem';
};

const getHeight = (size: 'L' | 'M'): string => {
  return size === 'L' ? '3.25rem' : '2.75rem';
};

const isRoundedActive = (variant: TVariant, value: number): boolean => {
  return variant === 'rounded' && value > 0;
};

const getBackgroundColor = (
  variant: TVariant,
  value: number,
  disabled: boolean,
  theme: Theme
): string => {
  if (isRoundedActive(variant, value)) {
    return baseTheme.colors.primary[500];
  }

  if (disabled) {
    return theme.mode.grey[50];
  }

  return theme.mode.undefined_palette[100];
};

const getBorderColor = (
  theme: Theme,
  variant: TVariant,
  value: number
): string => {
  if (isRoundedActive(variant, value)) {
    return baseTheme.colors.primary[500];
  }
  return theme.mode.grey[300];
};

const getTextColor = (
  theme: Theme,
  variant: TVariant,
  value: number,
  disabled: boolean
): string => {
  if (disabled) {
    return theme.mode.grey[500];
  }
  if (isRoundedActive(variant, value)) {
    return theme.mode.grey[50];
  }
  return theme.mode.grey[900];
};

const getFocusBackgroundColor = (
  variant: TVariant,
  value: number,
  disabled: boolean,
  theme: Theme
): string => {
  if (disabled) {
    return theme.mode.undefined_palette[800];
  }
  // rounded variant이고 value가 0보다 클 때만 primary 색상 사용
  if (isRoundedActive(variant, value)) {
    return colors.primary[500];
  }

  return theme.mode.white;
};

const getFocusTextColor = (
  variant: TVariant,
  value: number,
  disabled: boolean,
  theme: Theme
): string => {
  if (disabled) {
    return colors.grey[500];
  }
  // rounded variant이고 value가 0보다 클 때만 white 색상 사용
  if (isRoundedActive(variant, value)) {
    return colors.white;
  }
  return theme.mode.grey[900];
};

const getFocusIconColor = (
  variant: TVariant,
  value: number,
  disabled: boolean,
  theme: Theme
): string => {
  if (disabled) {
    return colors.grey[400];
  }
  // rounded variant이고 value가 0보다 클 때만 white 색상 사용
  if (isRoundedActive(variant, value)) {
    return colors.white;
  }
  return theme.mode.grey[800];
};

export const Container = styled.div<Props>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2px;
  width: ${({ size }) => getWidth(size)};
  max-width: ${({ size }) => getWidth(size)};
  min-width: ${({ size }) => getWidth(size)};
  height: ${({ size }) => getHeight(size)};
  padding: 4px 0;
  border: 1px solid
    ${({ variant, value, theme }) => getBorderColor(theme, variant, value)};
  border-radius: ${({ variant }) => getBorderRadius(variant)};
  background-color: ${({ variant, value, disabled, theme }) =>
    getBackgroundColor(variant, value, disabled, theme)};

  & > button {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    height: 2.75rem;
    width: 2.75rem;
    padding: 0;
    border-radius: ${({ variant }) => getBorderRadius(variant)};

    &:disabled {
      cursor: not-allowed;
    }
  }

  & > input {
    flex: 1;
    min-width: 28px;
    width: 100%;
    height: 100%;
    padding: 0;
    text-align: center;
    ${TYPOGRAPHY.MT_6}
    color: ${({ variant, value, disabled, theme }) =>
      getTextColor(theme, variant, value, disabled)};
    border: none;
    background: transparent;
    outline: none;

    &:disabled {
      cursor: not-allowed;
    }
  }

  &:focus-within {
    background-color: ${({ variant, value, disabled, theme }) =>
      getFocusBackgroundColor(variant, value, disabled, theme)};

    & > input {
      color: ${({ variant, value, disabled, theme }) =>
        getFocusTextColor(variant, value, disabled, theme)};
    }

    & > button {
      & > svg {
        color: ${({ variant, value, disabled, theme }) =>
          getFocusIconColor(variant, value, disabled, theme)} !important;
        fill: ${({ variant, value, disabled, theme }) =>
          getFocusIconColor(variant, value, disabled, theme)} !important;
      }
    }
  }
`;
