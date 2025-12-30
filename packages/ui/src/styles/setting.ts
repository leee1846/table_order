import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '../index';

// Common setting styles
export const Container = styled.section`
  background-color: ${theme.colors.white};
  padding: 17px 16px 17px 24px;
  border-radius: 0.75rem;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 0;
  border-bottom: 1px solid ${theme.colors.grey[400]};
`;

export const Title = styled.p`
  color: ${theme.colors.grey[800]};
  ${TYPOGRAPHY.MT_4}
`;

export const ContentsLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: space-between;
  gap: 12px;
  padding-top: 12px;
`;

export const ContentLayout = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  height: 3rem;

  & > p {
    color: ${theme.colors.grey[600]};
    ${TYPOGRAPHY.ST_2}
  }

  & > input {
    width: 6.6875rem;
    height: 1.625rem;
    border-bottom: 1px solid ${theme.colors.grey[400]};
    text-align: right;
    ${TYPOGRAPHY.ST_2}
    color: ${theme.colors.grey[800]};
  }
`;

export const TimeRangeInput = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 8rem;
  height: 1.625rem;
  border-bottom: 1px solid ${theme.colors.grey[400]};
  text-align: right;
  ${TYPOGRAPHY.ST_2}
  color: ${theme.colors.grey[800]};

  & > span {
    display: flex;
    align-items: center;
    justify-content: center;
    ${TYPOGRAPHY.ST_2}
    color: ${theme.colors.grey[800]};
  }

  & > input {
    text-align: center;
    width: 20%;
    ${TYPOGRAPHY.ST_2}
    color: ${theme.colors.grey[800]};

    &::placeholder {
      ${TYPOGRAPHY.ST_2}
      color: ${theme.colors.grey[800]};
    }
  }
`;

export const SingleTimeInput = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 1.625rem;
  border-bottom: 1px solid ${theme.colors.grey[400]};
  text-align: right;
  ${TYPOGRAPHY.ST_2}
  color: ${theme.colors.grey[800]};

  & > span {
    display: flex;
    align-items: center;
    justify-content: center;
    ${TYPOGRAPHY.ST_2}
    color: ${theme.colors.grey[800]};
  }

  & > input {
    text-align: center;
    width: 40%;
    ${TYPOGRAPHY.ST_2}
    color: ${theme.colors.grey[800]};

    &::placeholder {
      ${TYPOGRAPHY.ST_2}
      color: ${theme.colors.grey[800]};
    }
  }
`;

// Table styles
export const TablePageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${theme.colors.white};
`;

export const Table = styled.table`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

export const Thead = styled.thead`
  width: 100%;
  display: block;
  padding: 10px 6px;
  border-radius: 8px;
  background-color: ${theme.colors.grey[200]};

  & > tr {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  & > tr > th {
    flex: 1 1 0;
    min-width: 0;
    text-align: center;
    ${TYPOGRAPHY.ST_3}
    color: ${theme.colors.grey[600]};
    word-wrap: break-word;
    word-break: break-word;
  }
`;

export const Tbody = styled.tbody`
  width: 100%;
  display: block;
  overflow-y: auto;

  & > tr {
    width: 100%;
    padding: 14px 6px;
    display: flex;
    align-items: flex-start;
    gap: 6px;
    border-bottom: 1px solid ${theme.colors.grey[200]};
  }

  & > tr > td {
    flex: 1 1 0;
    min-width: 0;
    text-align: center;
    ${TYPOGRAPHY.ST_4}
    color: ${theme.colors.grey[700]};
    word-wrap: break-word;
    word-break: break-word;
  }
`;

export const Footer = styled.div`
  position: sticky;
  bottom: 0;
  padding: 16px 40px 24px;
  background-color: ${theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
`;

export const FooterContents = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  & > p {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    ${TYPOGRAPHY.ST_4}
    color: ${theme.colors.grey[700]};

    & > span:last-child {
      ${TYPOGRAPHY.ST_4}
      color: ${theme.colors.grey[500]};
    }
  }
`;
