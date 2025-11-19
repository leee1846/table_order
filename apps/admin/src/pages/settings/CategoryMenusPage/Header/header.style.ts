import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 31px;
`;

export const TextContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;

  & > h1 {
    color: ${theme.colors.grey[800]};
    ${TYPOGRAPHY.MT_1}
  }

  & > div {
    width: 0.125rem;
    height: 1.25rem;
    background-color: ${theme.colors.grey[800]};
  }

  & > h2 {
    color: ${theme.colors.grey[600]};
    ${TYPOGRAPHY.ST_1}
  }
`;
