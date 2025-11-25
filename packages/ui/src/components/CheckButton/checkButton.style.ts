import styled from '@emotion/styled';
import { css, SerializedStyles } from '@emotion/react';
import { TVariant } from './index';
import { ThemeMode } from '../../theme/modeColors';
import { baseTheme } from '../../index';

interface Props {
  checked: boolean;
  disabled: boolean;
  variant: TVariant;
  customStyle?: SerializedStyles;
}

const getBorderColor = (
  checked: boolean,
  disabled: boolean,
  mode: ThemeMode
): string => {
  if (disabled) {
    if (checked) {
      if (mode === 'dark') {
        return baseTheme.darkModeColors.primary[300];
      }
      return baseTheme.colors.primary[300];
    }

    if (mode === 'dark') {
      return baseTheme.darkModeColors.grey[200];
    }
    return baseTheme.colors.grey[200];
  }

  if (checked) {
    if (mode === 'dark') {
      return baseTheme.darkModeColors.primary[500];
    }
    return baseTheme.colors.primary[500];
  }

  if (mode === 'dark') {
    return baseTheme.darkModeColors.grey[400];
  }
  return baseTheme.colors.grey[400];
};

const getBackgroundColor = (
  checked: boolean,
  disabled: boolean,
  mode: ThemeMode
): string => {
  if (disabled) {
    if (checked) {
      if (mode === 'dark') {
        return baseTheme.darkModeColors.primary[300];
      }
      return baseTheme.colors.primary[300];
    }

    if (mode === 'dark') {
      return baseTheme.darkModeColors.grey[200];
    }
    return baseTheme.colors.grey[200];
  }

  if (checked) {
    if (mode === 'dark') {
      return baseTheme.darkModeColors.primary[500];
    }
    return baseTheme.colors.primary[500];
  }

  return baseTheme.colors.white;
};

const getCheckButtonStyles = (
  checked: boolean,
  disabled: boolean,
  mode: ThemeMode
) => {
  const borderColor = getBorderColor(checked, disabled, mode);
  const backgroundColor = getBackgroundColor(checked, disabled, mode);

  return css`
    background-color: ${backgroundColor};
    border: 0.125rem solid ${borderColor};
  `;
};

export const Label = styled.label<Props>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 7px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  width: fit-content;

  & > div {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.125rem;
    height: 1.125rem;
    border-radius: ${({ variant }) => (variant === 'round' ? '50%' : '6px')};
    ${({ checked, disabled, theme }) =>
      getCheckButtonStyles(checked, disabled, theme.themeMode)}
  }

  & > input {
    display: none;
  }
`;
