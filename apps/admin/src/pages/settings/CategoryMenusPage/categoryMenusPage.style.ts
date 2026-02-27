import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  background-color: ${theme.colors.grey[50]};
  padding: 40px 24px 40px 30px;
  height: 100%;
  overflow: auto;
`;

export const NoContent = styled.div`
  height: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ${TYPOGRAPHY.MT_4}
  color: ${theme.colors.grey[400]};
`;
