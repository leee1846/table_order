import styled from '@emotion/styled';
import { colors } from '../../theme/colors';
import { css } from '@emotion/react';
import { TSize } from './index';

interface Props {
  size: TSize;
  isOn: boolean;
  disabled: boolean;
}

const getTranslate = (size: TSize, isOn: boolean) => {
  switch (size) {
    case 'S':
      return isOn ? 'translateX(calc(100% - 4px))' : 'translateX(0)';
    case 'M':
      return isOn ? 'translateX(calc(100% - 8px))' : 'translateX(0)';
  }
};

const SmallButton = css`
  width: 36px;
  height: 20px;

  & > div {
    width: 17px;
    height: 17px;
  }
`;

const MediumButton = css`
  width: 52px;
  height: 30px;

  & > div {
    width: 27px;
    height: 27px;
  }
`;

export const Button = styled.button<Props>`
  display: flex;
  align-items: center;
  border-radius: 99px;
  background-color: ${({ isOn }) =>
    isOn ? colors.primary[500] : colors.grey[200]};
  padding: 1px;
  transition: transform 0.1s ease-in-out;
  ${({ size }) => {
    switch (size) {
      case 'S':
        return css`
          ${SmallButton}
        `;
      case 'M':
        return css`
          ${MediumButton}
        `;
      default:
        return css`
          ${SmallButton}
        `;
    }
  }};

  &:disabled {
    background-color: ${({ isOn }) =>
      isOn ? colors.primary[200] : colors.grey[400]};
    cursor: not-allowed;
  }

  & > div {
    border-radius: 50%;
    border: 1px solid ${colors.grey[300]};
    background-color: ${colors.white};
    transform: ${({ isOn, size }) => getTranslate(size, isOn)};
    transition: transform 0.1s ease-in-out;
  }
`;
