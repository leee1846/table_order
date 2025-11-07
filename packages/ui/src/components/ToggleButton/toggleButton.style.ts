import styled from '@emotion/styled';
import { colors } from '../../theme/colors';
import { css } from '@emotion/react';
import { TSize } from './index';

interface Props {
  size: TSize;
  isOn: boolean;
  disabled: boolean;
}

// Size별 설정 타입
interface SizeConfig {
  width: string;
  height: string;
  thumbSize: string;
  translateOffset: {
    on: string;
    off: string;
  };
}

// Size별 설정 객체 - 확장성을 위해 Record 타입 사용
const SIZE_CONFIG: Record<TSize, SizeConfig> = {
  S: {
    width: '2.25rem',
    height: '1.25rem',
    thumbSize: '1.0625rem',
    translateOffset: {
      on: '0.325rem',
      off: '-0.3rem',
    },
  },
  M: {
    width: '3.25rem',
    height: '1.875rem',
    thumbSize: '1.6875rem',
    translateOffset: {
      on: '0.6rem',
      off: '-0.3rem',
    },
  },
};

// Translate 값 계산 함수
const getTranslate = (size: TSize, isOn: boolean): string => {
  const config = SIZE_CONFIG[size];
  const offset = isOn ? config.translateOffset.on : config.translateOffset.off;
  return isOn ? `translateX(calc(100% - ${offset}))` : `translateX(${offset})`;
};

// Size별 스타일 생성 함수
const getSizeStyles = (size: TSize) => {
  const config = SIZE_CONFIG[size];
  return css`
    width: ${config.width};
    height: ${config.height};

    & > div {
      width: ${config.thumbSize};
      height: ${config.thumbSize};
    }
  `;
};

// 배경색 계산 함수
const getBackgroundColor = (isOn: boolean, disabled: boolean): string => {
  if (disabled) {
    return isOn ? colors.primary[200] : colors.grey[400];
  }
  return isOn ? colors.primary[500] : colors.grey[200];
};

export const Button = styled.button<Props>`
  display: flex;
  align-items: center;
  border-radius: 6.1875rem;
  background-color: ${({ isOn, disabled }) =>
    getBackgroundColor(isOn, disabled)};
  transition: transform 0.1s ease-in-out;
  ${({ size }) => getSizeStyles(size)}

  &:disabled {
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
