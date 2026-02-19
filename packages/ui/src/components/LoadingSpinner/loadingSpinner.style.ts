import styled from '@emotion/styled';

export const Wrapper = styled.div<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`;

export const LottieInner = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
