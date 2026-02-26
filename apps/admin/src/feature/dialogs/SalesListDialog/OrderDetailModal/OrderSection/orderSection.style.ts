import { theme, TYPOGRAPHY } from '@repo/ui';
import styled from '@emotion/styled';

export const Container = styled.div``;

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  & > p {
    color: ${theme.colors.grey[800]};
    ${TYPOGRAPHY.MT_6}
  }
  & > div {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

export const OrderInfoContainer = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 24px;
  & > div {
    display: flex;
    gap: 6px;
    width: 100%;

    & > p {
      display: flex;
      flex-direction: column;
      gap: 2px;
      ${TYPOGRAPHY.BD_2}
      color: ${theme.colors.grey[500]};

      & > span {
        ${TYPOGRAPHY.MT_7}
        color: ${theme.colors.grey[900]};
      }
    }

    &:first-of-type > p {
      flex: 2 1 0;
      min-width: 0;
    }

    &:last-of-type > p {
      flex: 2 1 0;
      min-width: 0;
    }
  }
`;

export const OrderList = styled.div`
  border-top: 1px solid ${theme.colors.grey[200]};
  max-height: 218px;
  overflow-y: auto;

  & > ul {
    padding: 12px;
    border-radius: 12px;
    background-color: ${theme.colors.grey[50]};

    & > li {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 8px;
    }
  }
`;

export const MenuItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  & > p {
    ${TYPOGRAPHY.MT_7}
    color: ${theme.colors.grey[800]};
  }
  & > p:first-of-type {
    width: 70%;
  }
  & > p:nth-of-type(2) {
    width: 10%;
    text-align: center;
  }
  & > p:last-of-type {
    width: 20%;
    text-align: right;
  }
`;

export const OptionItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  & > p {
    ${TYPOGRAPHY.ST_4}
    color: ${theme.colors.grey[500]};

    & > span {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-left: 1.25px solid ${theme.colors.grey[500]};
      border-bottom: 1.2px solid ${theme.colors.grey[500]};
      margin: 0 4px 4px 0;
    }
  }
  & > p:first-of-type {
    width: 70%;
  }
  & > p:nth-of-type(2) {
    width: 10%;
    text-align: center;
  }
  & > p:last-of-type {
    width: 20%;
    text-align: right;
  }
`;

export const Total = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px 0 24px;
  border-top: 1px solid ${theme.colors.grey[200]};

  & > p {
    ${TYPOGRAPHY.MT_2}
    color: ${theme.colors.primary[500]};
  }
  & > p:first-of-type {
    width: 70%;
    color: ${theme.colors.grey[800]};
  }
  & > p:nth-of-type(2) {
    width: 10%;
    text-align: center;
  }
  & > p:last-of-type {
    width: 20%;
    text-align: right;
  }
`;
