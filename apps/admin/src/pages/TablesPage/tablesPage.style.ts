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
  padding: 50px;
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  grid-auto-rows: 154px;
  gap: 12px;
  justify-content: start;
  align-content: start;
  width: 100%;
  height: 100%;
`;
