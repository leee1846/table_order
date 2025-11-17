import styled from '@emotion/styled';
import { theme } from '../index';
import { TYPOGRAPHY } from '../theme/typography';

export const TablePageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background-color: ${theme.colors.white};
`;

export const Table = styled.table`
  width: 100%;
  display: block;
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
    align-items: flex-start;
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
  border-top: 1px solid ${theme.colors.grey[200]};
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
