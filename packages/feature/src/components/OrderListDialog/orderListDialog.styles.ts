import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';

const { colors, zIndex } = theme;

export const DialogContainer = styled.div`
  background-color: ${colors.white};
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 90vw;
  height: 90vh;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${zIndex.modal + 1};
`;

export const Header = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  position: relative;
  margin-top: 20px;
  margin-bottom: 24px;
  padding: 24px 24px 0 24px;
`;

export const Title = styled.h3`
  ${TYPOGRAPHY.MT_1}
  color: ${colors.grey[800]};
`;

export const TableContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 24px;
`;

export const Table = styled.table`
  width: 100%;
`;

export const Thead = styled.thead`
  position: sticky;
  top: 0;

  & > tr {
    display: flex;
    padding: 10px 6px;
    background-color: ${colors.grey[200]};
    border-radius: 8px;
  }

  & > tr > th {
    flex: 1 1 0;
    text-align: center;
    ${TYPOGRAPHY.ST_3}
    color: ${colors.grey[600]};
    word-wrap: break-word;
    word-break: break-word;
  }
`;

export const Tbody = styled.tbody`
  & > tr {
    display: flex;
    width: 100%;
    padding: 14px 6px;
    border-bottom: 1px solid ${colors.grey[200]};
    transition: background-color 0.2s;
  }

  & > tr > td {
    flex: 1 1 0;
    min-width: 0;
    text-align: center;
    ${TYPOGRAPHY.ST_4}
    color: ${colors.grey[700]};
    word-wrap: break-word;
    word-break: break-word;
  }
`;

export const PaginationWrapper = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  padding: 24px 24px 54px 24px;
  border-top: 1px solid ${colors.grey[200]};
`;

export const Pagenation = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;
