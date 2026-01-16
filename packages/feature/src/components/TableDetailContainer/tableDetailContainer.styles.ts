import styled from '@emotion/styled';
import { theme } from '@repo/ui';

const { colors } = theme;

export const TableDetailContainer = styled.div<{ isReady: boolean }>`
  width: 100%;
  height: 100vh;
  opacity: ${({ isReady }) => (isReady ? 1 : 0)};
  transition: opacity 0.001s ease-in;
`;

export const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  height: 100%;
`;

export const Left = styled.div`
  background: ${colors.white};
  padding: 30px 24px;
  height: 100%;
  overflow: hidden;
`;

export const Right = styled.div`
  background: ${colors.grey[700]};
  padding: 30px 50px;
`;
