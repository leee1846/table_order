import styled from '@emotion/styled';
import { theme } from '@repo/ui';

const { colors } = theme;

export const TablePageContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

export const TableGridContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colors.grey[600]};
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 190px);
  grid-auto-rows: 154px;
  gap: 12px;
  justify-content: center;
  align-content: start;
  padding: 100px 0;
  width: 100%;
  height: 100vh;
  overflow-y: auto;
`;
