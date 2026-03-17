import styled from '@emotion/styled';
import { zIndex } from '../../theme/zIndex';

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${zIndex.popover};
  background-color: transparent;
`;

const colorFilterMap: Record<string, string> = {
  green: 'hue-rotate(120deg)',
  orange: 'hue-rotate(30deg)',
  purple: 'hue-rotate(270deg)',
  red: 'hue-rotate(330deg)',
};

export const SpinnerWrapper = styled.div<{ size: number; color?: string }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ color }) => color && colorFilterMap[color] && `filter: ${colorFilterMap[color]};`}
`;
