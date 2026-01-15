import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 40px 24px 24px 30px;
  flex: 1;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 30px;
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
  padding: 10px 20px;
  border-radius: 12px;
  border: 0.5px solid ${theme.colors.grey[300]};
  background-color: ${theme.colors.white};
  cursor: pointer;
  margin-left: 20px;
`;

export const CalendarText = styled.span`
  ${TYPOGRAPHY.ST_2}
  color: ${theme.colors.grey[900]};
`;

export const Filters = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
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
      selected ? theme.colors.primary[500] : theme.colors.grey[300]};
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

export const StatusText = styled.span<{ cancel?: boolean }>`
  ${TYPOGRAPHY.ST_4}
  color: ${({ cancel }) =>
    cancel ? theme.colors.semantic[500] : theme.colors.grey[700]};
`;

export const PaymentMethod = styled.span`
  ${TYPOGRAPHY.ST_4}
  color: ${theme.colors.grey[700]};
`;

export const IconWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
`;

export const Tooltip = styled.div`
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  z-index: ${theme.zIndex.tooltip};
  background-color: ${theme.colors.grey[800]};
  color: ${theme.colors.white};
  padding: 8px 12px;
  border-radius: 8px;
  white-space: nowrap;
  ${TYPOGRAPHY.ST_4}
  pointer-events: none;
`;

export const TooltipText = styled.span`
  display: block;
`;

export const TooltipArrow = styled.div`
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid ${theme.colors.grey[800]};
`;

export const TableRow = styled.tr<{ isCancel?: boolean }>`
  ${({ isCancel }) =>
    isCancel &&
    `
    & > td {
      color: ${theme.colors.semantic[500]};
    }
  `}
`;
