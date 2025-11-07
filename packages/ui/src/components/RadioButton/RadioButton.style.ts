import styled from '@emotion/styled';
import { colors } from '../../theme/colors';
import { css } from '@emotion/react';

interface Props {
  checked: boolean;
  disabled: boolean;
}

const getBorderColor = (checked: boolean, disabled: boolean): string => {
  if (checked) {
    return disabled ? colors.primary[300] : colors.primary[500];
  }
  return colors.grey[300];
};

const getBackgroundColor = (checked: boolean, disabled: boolean): string => {
  if (checked) {
    return 'transparent';
  }
  return disabled ? colors.grey[100] : colors.white;
};

const getRadioButtonStyles = (checked: boolean, disabled: boolean) => {
  const borderColor = getBorderColor(checked, disabled);
  const backgroundColor = getBackgroundColor(checked, disabled);

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
    ${({ checked, disabled }) => getRadioButtonStyles(checked, disabled)}
  }
`;
