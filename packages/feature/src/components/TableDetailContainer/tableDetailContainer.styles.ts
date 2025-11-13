import styled from '@emotion/styled';
import { theme } from '@repo/ui';

const { colors } = theme;

export const TableDetailContainer = styled.div`
  width: 100%;
  height: 100vh;
`;

export const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  height: 100%;
`;

export const Left = styled.div`
  background: ${colors.white};
  padding: 30px 24px;
`;

export const Right = styled.div`
  background: ${colors.grey[700]};
  padding: 30px 50px;
`;
