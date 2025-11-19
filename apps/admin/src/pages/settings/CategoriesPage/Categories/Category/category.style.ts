import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px 20px;
  background-color: ${theme.colors.white};
  border-radius: 1rem;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.08);
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;

  & > div {
    display: flex;
    align-items: center;

    & > span {
      color: ${theme.colors.grey[900]};
      ${TYPOGRAPHY.MT_6}
    }

    & > button {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  & > button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background-color: ${theme.colors.grey[50]};
    border: 1px solid ${theme.colors.grey[300]};
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.08);
    cursor: pointer;
  }
`;

export const Badges = styled.ul`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid ${theme.colors.grey[200]};

  & > li {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 10px;
    background-color: ${theme.colors.grey[100]};
    border-radius: 8px;

    & > p:first-of-type {
      color: ${theme.colors.grey[500]};
      ${TYPOGRAPHY.CT_2}
    }

    & > p:last-of-type {
      color: ${theme.colors.grey[800]};
      ${TYPOGRAPHY.ST_3}
    }
  }
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const HiddenContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  & > p {
    color: ${theme.colors.grey[500]};
    ${TYPOGRAPHY.BD_2}
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  & > button {
    width: 7.53125rem;
  }
`;
