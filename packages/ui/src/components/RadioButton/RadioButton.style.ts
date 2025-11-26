import styled from '@emotion/styled';
import { css, Theme } from '@emotion/react';

interface Props {
  checked: boolean;
  disabled: boolean;
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

    return theme.mode.grey[300];
  }

  if (checked) {
    return theme.mode.primary[500];
  }

  return theme.mode.grey[300];
};

const getBackgroundColor = (
  checked: boolean,
  disabled: boolean,
  theme: Theme
): string => {
  if (disabled) {
    if (checked) {
      return theme.mode.undefined_palette[200];
    }

    return theme.mode.grey[100];
  }

  if (checked) {
    return theme.mode.grey[100];
  }

  return theme.colors.white;
};

const getRadioButtonStyles = (
  checked: boolean,
  disabled: boolean,
  theme: Theme
) => {
  const borderColor = getBorderColor(checked, disabled, theme);
  const backgroundColor = getBackgroundColor(checked, disabled, theme);

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
      getRadioButtonStyles(checked, disabled, theme)}
  }
`;
