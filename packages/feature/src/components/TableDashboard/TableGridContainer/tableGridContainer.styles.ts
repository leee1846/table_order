import styled from '@emotion/styled';
import { theme } from '@repo/ui';

const { colors } = theme;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
  padding: 16px;
  background: ${colors.grey[200]};
  min-height: 100%;
  overflow-y: auto;
`;

