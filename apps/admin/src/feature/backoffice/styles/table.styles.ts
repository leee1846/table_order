import styled from '@emotion/styled';
import { theme } from '@repo/ui';

export const TableContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

export const TableElement = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${theme.colors.white};
`;

export const Thead = styled.thead`
  background-color: ${theme.colors.grey[50]};
  position: sticky;
  top: 0;
  z-index: 10;
`;

export const Tbody = styled.tbody`
  background-color: ${theme.colors.white};
`;

export const Tr = styled.tr`
  border-bottom: 1px solid ${theme.colors.grey[200]};

  &:last-child {
    border-bottom: none;
  }
`;

export const Th = styled.th`
  padding: 10px 16px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.grey[600]};
  letter-spacing: 0.01em;
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-bottom: 1px solid ${theme.colors.grey[200]};
  text-transform: uppercase;

  &:first-of-type {
    padding-left: 24px;
  }

  &:last-of-type {
    padding-right: 24px;
  }
`;

export const Td = styled.td`
  padding: 6px 16px;
  text-align: center;
  font-size: 13px;
  font-weight: 400;
  color: ${theme.colors.grey[900]};
  letter-spacing: -0.005em;
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:first-of-type {
    padding-left: 24px;
  }

  &:last-of-type {
    padding-right: 24px;
  }
`;

export const EmptyRow = styled.tr``;

export const EmptyCell = styled.td`
  padding: 48px 16px;
  text-align: center;
  font-size: 14px;
  color: ${theme.colors.grey[500]};
  letter-spacing: -0.005em;
`;

export const ActionCell = styled.td`
  padding: 6px 20px;
  text-align: center;

  &:last-of-type {
    padding-right: 24px;
  }
`;

export const ActionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;

  & > button {
    padding: 0 10px;
  }
`;
