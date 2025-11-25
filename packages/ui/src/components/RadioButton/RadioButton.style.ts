import styled from '@emotion/styled';
import { colors } from '../../theme/colors';
import { baseTheme } from '../../index';
import { css } from '@emotion/react';
import { ThemeMode } from '../../theme/modeColors';

interface Props {
  checked: boolean;
  disabled: boolean;
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
      return baseTheme.darkModeColors.grey[300];
    }
    return baseTheme.colors.grey[300];
  }

  if (checked) {
    if (mode === 'dark') {
      return baseTheme.darkModeColors.primary[500];
    }
    return baseTheme.colors.primary[500];
  }

  if (mode === 'dark') {
    return baseTheme.darkModeColors.grey[300];
  }
  return baseTheme.colors.grey[300];
};

const getBackgroundColor = (
  checked: boolean,
  disabled: boolean,
  mode: ThemeMode
): string => {
  if (disabled) {
    if (checked) {
      if (mode === 'dark') {
        return baseTheme.darkModeColors.grey[50];
      }
      return baseTheme.colors.white;
    }

    if (mode === 'dark') {
      return baseTheme.darkModeColors.grey[100];
    }
    return baseTheme.colors.grey[100];
  }

  if (checked) {
    if (mode === 'dark') {
      return baseTheme.darkModeColors.grey[100];
    }
    return baseTheme.colors.grey[100];
  }

  return baseTheme.colors.white;
};

const getRadioButtonStyles = (
  checked: boolean,
  disabled: boolean,
  mode: ThemeMode
) => {
  const borderColor = getBorderColor(checked, disabled, mode);
  const backgroundColor = getBackgroundColor(checked, disabled, mode);

  if (checked) {
    return css`
      border: 0.525rem solid ${borderColor};
    `;
  }

  return css`
    border: 0.125rem solid ${borderColor};
    background-color: ${backgroundColor};
  `;
};

export const Label = styled.label<Props>`
  display: flex;
  align-items: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  width: fit-content;

  & > div {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    ${({ checked, disabled, theme }) =>
      getRadioButtonStyles(checked, disabled, theme.themeMode)}
  }
`;
