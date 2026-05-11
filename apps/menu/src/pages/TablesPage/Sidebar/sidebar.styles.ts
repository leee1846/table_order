import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const HomeButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 24px 0;
  margin-top: auto;
  background-color: ${theme.colors.grey[900]};
  cursor: pointer;

  span {
    ${TYPOGRAPHY.MT_6}
    color: ${theme.colors.grey[600]};
  }
`;
