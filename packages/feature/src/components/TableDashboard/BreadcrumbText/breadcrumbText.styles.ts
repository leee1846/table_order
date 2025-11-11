import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

const { colors } = theme;

export const BreadcrumbContainer = styled.div`
  ${TYPOGRAPHY.ST_4}
  color: ${colors.grey[800]};
  padding: 16px 0;
`;
