import styled from '@emotion/styled';
import { theme } from '@repo/ui';

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
`;

const { colors } = theme;

export const TableArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colors.grey[600]};
  overflow-y: auto;
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 190px);
  grid-auto-rows: minmax(154px, auto);
  gap: 12px;
  padding: 16px;
  justify-content: start;
  align-content: start;
  width: 100%;
`;
