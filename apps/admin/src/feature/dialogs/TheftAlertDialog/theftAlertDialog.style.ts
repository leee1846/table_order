import styled from '@emotion/styled';
import { theme } from '@repo/ui';

const { zIndex } = theme;
export const AlertMessage = styled.p`
  font-size: 16px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grey[600]};
  text-align: center;
  margin: 8px 0;
  white-space: pre-line;
  z-index: ${zIndex.popover};
`;
