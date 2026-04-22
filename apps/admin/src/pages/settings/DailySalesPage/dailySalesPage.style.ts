import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px 24px 24px 30px;
  flex: 1;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-bottom: 20px;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  color: ${theme.colors.grey[800]};
  ${TYPOGRAPHY.MT_1}

  & > div {
    width: 0.125rem;
    height: 1.25rem;
    background-color: ${theme.colors.grey[800]};
  }

  & > span {
    ${TYPOGRAPHY.ST_1}
    color: ${theme.colors.grey[600]};
  }
`;

export const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const CalendarButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  border-radius: 12px;
  border: 0.5px solid ${theme.colors.grey[300]};
  background-color: ${theme.colors.white};
  cursor: pointer;
`;

export const CalendarText = styled.span`
  ${TYPOGRAPHY.ST_5}
  color: ${theme.colors.grey[900]};
`;

export const Filters = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
  padding: 0 12px;
`;

export const Tabs = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const TabButton = styled.button<{ selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid
    ${({ selected }) =>
      selected ? theme.colors.primary[300] : theme.colors.grey[300]};
  background-color: ${({ selected }) =>
    selected ? theme.colors.primary[100] : theme.colors.grey[100]};
  color: ${({ selected }) =>
    selected ? theme.colors.primary[700] : theme.colors.grey[700]};
  ${TYPOGRAPHY.ST_3}
  cursor: pointer;
  min-width: 82px;
`;

export const TableCard = styled.div`
  padding: 10px;
`;

export const HeaderLabel = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  ${TYPOGRAPHY.ST_3}
  color: ${theme.colors.grey[600]};
`;

export const SummaryRow = styled.tr`
  background-color: ${theme.colors.grey[50]};
  & > td {
    color: ${theme.colors.grey[800]};
    font-weight: 700 !important;
  }
`;

export const PaymentMethod = styled.span`
  ${TYPOGRAPHY.ST_4}
  color: ${theme.colors.grey[700]};
`;

export const TableRow = styled.tr<{ isCancel?: boolean }>`
  white-space: nowrap;

  ${({ isCancel }) =>
    isCancel &&
    `
    & > td {
      color: ${theme.colors.semantic[500]};
    }
  `}
`;
