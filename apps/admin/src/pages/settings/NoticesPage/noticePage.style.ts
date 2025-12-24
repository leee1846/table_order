import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 40px 24px 0 30px;
  flex: 1;
  min-height: 0;
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;

  & > h1 {
    color: ${theme.colors.grey[800]};
    ${TYPOGRAPHY.MT_1}
  }
`;
