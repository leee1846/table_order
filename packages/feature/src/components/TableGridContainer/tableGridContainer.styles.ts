import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

const { colors } = theme;

export const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${colors.grey[600]};
  flex: 1;
  overflow-y: auto;
`;

export const NoContent = styled.p`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: ${colors.grey[200]};
  ${TYPOGRAPHY.ST_1}
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 190px);
  grid-auto-rows: minmax(154px, auto);
  gap: 12px;
  padding: 16px;
  justify-content: start;
  align-content: start;
  overflow-y: auto;
`;
