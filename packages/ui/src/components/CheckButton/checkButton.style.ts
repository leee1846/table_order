import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { TVariant } from './index';
import { colors } from '../../theme/colors';

interface Props {
  checked: boolean;
  disabled: boolean;
  variant: TVariant;
}

const getBorderColor = (checked: boolean, disabled: boolean): string => {
  if (checked) {
    return disabled ? colors.primary[300] : colors.primary[500];
  }
  return colors.grey[400];
};

const getBackgroundColor = (checked: boolean, disabled: boolean): string => {
  if (checked) {
    return disabled ? colors.primary[300] : colors.primary[500];
  }
  return disabled ? colors.grey[200] : colors.white;
};

const getCheckButtonStyles = (checked: boolean, disabled: boolean) => {
  const borderColor = getBorderColor(checked, disabled);
  const backgroundColor = getBackgroundColor(checked, disabled);

  return css`
    background-color: ${backgroundColor};
    border: 0.125rem solid ${borderColor};
  `;
};

export const Label = styled.label<Props>`
  position: relative;
  display: flex;
  align-items: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  width: fit-content;

  & > div {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.125rem;
    height: 1.125rem;
    border-radius: ${({ variant }) => (variant === 'round' ? '50%' : '6px')};
    ${({ checked, disabled }) => getCheckButtonStyles(checked, disabled)}
  }
`;
