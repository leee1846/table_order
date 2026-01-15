import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px 24px 24px 30px;
  flex: 1;
  height: 100%;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  color: ${theme.colors.grey[800]};
  ${TYPOGRAPHY.MT_1}
  margin-bottom: 20px;

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

export const FilterBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  width: 100%;
`;

export const DateRange = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 20px;
`;

export const DateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  border-radius: 12px;
  border: 0.5px solid ${theme.colors.grey[300]};
  background-color: ${theme.colors.white};
  cursor: pointer;
`;

export const DateText = styled.span`
  ${TYPOGRAPHY.ST_5}
  color: ${theme.colors.grey[900]};
`;

export const RangeDivider = styled.span`
  ${TYPOGRAPHY.ST_3}
  color: ${theme.colors.grey[500]};
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
  flex-wrap: wrap;
`;

export const TableCard = styled.div`
  flex: 1;
  overflow: visible;
  display: flex;
  flex-direction: column;
  min-height: 0;
  border-radius: 12px;
  border: 1px solid ${theme.colors.grey[300]};
`;

export const HeaderLabel = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  ${TYPOGRAPHY.ST_3}
  color: ${theme.colors.grey[600]};
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
  z-index: 9999;
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

export const Metric = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  ${TYPOGRAPHY.ST_4}
  color: ${theme.colors.grey[700]};

  strong {
    ${TYPOGRAPHY.CT_2}
    color: ${theme.colors.grey[800]};
  }
`;

export const SummaryRow = styled.tr`
  background-color: ${theme.colors.grey[100]};
  border-top: 1.5px solid ${theme.colors.grey[300]};

  & > td {
    font-weight: 800 !important;
    padding-top: 10px;

    > div {
      font-weight: 800 !important;
    }
  }
`;

export const EmptyRow = styled.tr`
  ${TYPOGRAPHY.ST_3}
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;

  > td {
    padding: 16px 0;
    text-align: center;
    color: ${theme.colors.grey[500]};
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: visible;
`;

export const FixedHeader = styled.div`
  overflow: visible;
  flex-shrink: 0;

  table {
    overflow: visible;

    thead {
      border-radius: 0;
      position: relative;
      overflow: visible;
    }

    thead > tr {
      overflow: visible;
    }

    thead > tr > th {
      word-break: keep-all !important;
      word-wrap: normal !important;
      overflow-wrap: normal !important;
      white-space: normal !important;
      text-align: center !important;
      overflow: visible;
    }
  }
`;

export const ScrollableTable = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: auto;
  min-height: 0;

  table {
    tbody {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    tbody > tr > td {
      word-break: keep-all !important;
      word-wrap: normal !important;
      overflow-wrap: normal !important;
      white-space: normal !important;
      text-align: center !important;
    }
  }
`;

export const FixedFooter = styled.div`
  background-color: ${theme.colors.white};
  flex-shrink: 0;

  table {
    thead > tr > th {
      word-break: keep-all !important;
      word-wrap: normal !important;
      overflow-wrap: normal !important;
      white-space: normal !important;
      text-align: center !important;
    }

    tbody > tr > td {
      word-break: keep-all !important;
      word-wrap: normal !important;
      overflow-wrap: normal !important;
      white-space: normal !important;
      text-align: center !important;
    }
  }
`;
