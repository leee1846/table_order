import styled from '@emotion/styled';
import { TVariant } from './index';
import { css } from '@emotion/react';
import { colors } from '../../theme/colors';

interface Props {
  checked: boolean;
  disabled: boolean;
  variant: TVariant;
}

const getCss = (checked: boolean, disabled: boolean) => {
  if (checked) {
    if (disabled) {
      return css`
        background-color: ${colors.primary[300]};
        border: 2px solid ${colors.primary[300]};
      `;
    }
    return css`
      background-color: ${colors.primary[500]};
      border: 2px solid ${colors.primary[500]};
    `;
  }

  if (disabled) {
    return css`
      background-color: ${colors.grey[200]};
      border: 2px solid ${colors.grey[400]};
    `;
  }

  return css`
    background-color: ${colors.white};
    border: 2px solid ${colors.grey[400]};
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
    width: 18px;
    height: 18px;
    border-radius: ${({ variant }) => (variant === 'round' ? '50%' : '6px')};
    ${({ checked, disabled }) => getCss(checked, disabled)}
  }
`;
