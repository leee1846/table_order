import styled from '@emotion/styled';
import { colors } from '../../theme/colors';
import { TVariant } from '.';
import { TYPOGRAPHY } from '../../theme/typography';
import { baseTheme, Theme } from '../../index';

interface Props {
  variant: TVariant;
  size: 'M' | 'S';
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

const getWidth = (size: 'M' | 'S'): string => {
  return size === 'M' ? '11.25rem' : '8.125rem';
};

const getHeight = (size: 'M' | 'S'): string => {
  return size === 'M' ? '3.25rem' : '2.75rem';
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
    return baseTheme.colors.grey[300];
  }

  if (theme.themeMode === 'dark') {
    return baseTheme.darkModeColors.background[100];
  }
  return baseTheme.colors.white;
};

const getBorderColor = (
  theme: Theme,
  variant: TVariant,
  value: number
): string => {
  if (isRoundedActive(variant, value)) {
    return baseTheme.colors.primary[500];
  }
  if (theme.themeMode === 'dark') {
    return baseTheme.darkModeColors.grey[300];
  }
  return baseTheme.colors.grey[300];
};

const getTextColor = (
  theme: Theme,
  variant: TVariant,
  value: number,
  disabled: boolean
): string => {
  if (disabled) {
    return baseTheme.colors.grey[500];
  }
  if (isRoundedActive(variant, value)) {
    return baseTheme.colors.grey[50];
  }
  return theme.mode.grey[900];
};

const getFocusBackgroundColor = (
  variant: TVariant,
  disabled: boolean,
  theme: Theme
): string => {
  if (disabled) {
    return theme.themeMode === 'dark'
      ? baseTheme.darkModeColors.grey[300]
      : colors.grey[50];
  }
  if (variant === 'rounded') {
    return colors.primary[500];
  }
  return theme.themeMode === 'dark'
    ? baseTheme.darkModeColors.background[100]
    : colors.grey[50];
};

const getFocusTextColor = (
  variant: TVariant,
  disabled: boolean,
  theme: Theme
): string => {
  if (disabled) {
    return colors.grey[500];
  }
  if (variant === 'rounded') {
    return colors.white;
  }
  return theme.mode.grey[900];
};

const getFocusIconColor = (
  variant: TVariant,
  disabled: boolean,
  theme: Theme
): string => {
  if (disabled) {
    return colors.grey[400];
  }
  if (variant === 'rounded') {
    return colors.white;
  }
  return theme.themeMode === 'dark'
    ? baseTheme.darkModeColors.grey[800]
    : colors.grey[800];
};

export const Container = styled.div<Props>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: ${({ size }) => getWidth(size)};
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
    background-color: ${({ variant, disabled, theme }) =>
      getFocusBackgroundColor(variant, disabled, theme)};

    & > input {
      color: ${({ variant, disabled, theme }) =>
        getFocusTextColor(variant, disabled, theme)};
    }

    & > button {
      & > svg {
        color: ${({ variant, disabled, theme }) =>
          getFocusIconColor(variant, disabled, theme)} !important;
        fill: ${({ variant, disabled, theme }) =>
          getFocusIconColor(variant, disabled, theme)} !important;
      }
    }
  }
`;
