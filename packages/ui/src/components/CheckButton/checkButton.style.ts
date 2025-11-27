import styled from '@emotion/styled';
import { css, SerializedStyles, Theme } from '@emotion/react';
import { TVariant } from './index';

interface Props {
  checked: boolean;
  disabled: boolean;
  variant: TVariant;
  customStyle?: SerializedStyles;
}

const getBorderColor = (
  checked: boolean,
  disabled: boolean,
  theme: Theme
): string => {
  if (disabled) {
    if (checked) {
      return theme.mode.primary[300];
    }

    return theme.mode.grey[200];
  }

  if (checked) {
    return theme.mode.primary[500];
  }

  return theme.mode.grey[400];
};

const getBackgroundColor = (
  checked: boolean,
  disabled: boolean,
  theme: Theme
): string => {
  if (disabled) {
    if (checked) {
      return theme.mode.primary[300];
    }

    return theme.mode.grey[200];
  }

  if (checked) {
    return theme.mode.primary[500];
  }

  return 'transparent';
};

const getCheckButtonStyles = (
  checked: boolean,
  disabled: boolean,
  theme: Theme
) => {
  const borderColor = getBorderColor(checked, disabled, theme);
  const backgroundColor = getBackgroundColor(checked, disabled, theme);

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
      getCheckButtonStyles(checked, disabled, theme)}
  }

  & > input {
    display: none;
  }
`;
