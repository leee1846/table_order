import styled from '@emotion/styled';
import { theme } from '@repo/ui';

const { colors } = theme;

export const TablePageContainer = styled.div`
  display: flex;
  width: 100%;
`;

export const TableGridContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${colors.grey[600]};
  flex: 1;
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
