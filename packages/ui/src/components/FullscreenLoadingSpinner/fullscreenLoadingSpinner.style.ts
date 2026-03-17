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

export const SpinnerWrapper = styled.div<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
