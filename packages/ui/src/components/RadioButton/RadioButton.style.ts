import styled from '@emotion/styled';
import { colors } from '../../theme/colors';
import { css } from '@emotion/react';

interface Props {
  checked: boolean;
  disabled: boolean;
}

const getCss = (checked: boolean, disabled: boolean) => {
  if (checked) {
    return css`
      border: 8px solid ${disabled ? colors.primary[300] : colors.primary[500]};
    `;
  }

  return css`
    border: 2px solid ${disabled ? colors.grey[300] : colors.grey[300]};
    background-color: ${disabled ? colors.grey[100] : colors.white};
  `;
};

export const Label = styled.label<Props>`
  display: flex;
  align-items: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  width: fit-content;

  & > div {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    ${({ checked, disabled }) => {
      return getCss(checked, disabled);
    }}
  }
`;
