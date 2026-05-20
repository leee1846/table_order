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
  background-color: ${theme.colors.white};
  cursor: pointer;
  border-top: 2px solid ${theme.colors.grey[200]};

  span {
    ${TYPOGRAPHY.MT_6}
    color: ${theme.colors.grey[600]};
  }
`;
