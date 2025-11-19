import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const Container = styled.div`
  position: absolute;
  top: 0;
  left: 13.125rem;
  right: 0;
  height: 100%;
  padding: 40px 24px 40px 30px;
  overflow-y: auto;
  background-color: ${theme.colors.white};
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;

  & > div {
    display: flex;
    align-items: center;
  }
`;

export const Titles = styled.div`
  display: flex;
  align-items: center;

  & > p {
    color: ${theme.colors.grey[800]};
    ${TYPOGRAPHY.MT_1}
  }

  & > span {
    width: 0.125rem;
    height: 1.25rem;
    margin: 0 11px;
    background-color: ${theme.colors.semantic[800]};
  }

  & > div {
    display: flex;
    align-items: center;

    & > svg {
      margin-top: 4px;
    }

    & > p {
      color: ${theme.colors.grey[600]};
      ${TYPOGRAPHY.ST_1}
    }

    & > p:last-child {
      color: ${theme.colors.primary[500]};
      ${TYPOGRAPHY.ST_1}
    }
  }
`;
