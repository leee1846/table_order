import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const NoContent = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: ${theme.colors.grey[600]};
  padding-top: 100px;
  ${TYPOGRAPHY.ST_1}
`;
