import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const Container = styled.div`
  padding: 40px 24px 40px 30px;
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 35px;

  & > h1 {
    display: flex;
    align-items: center;
    gap: 4px;
    color: ${theme.colors.grey[800]};
    ${TYPOGRAPHY.MT_1}
  }
`;
