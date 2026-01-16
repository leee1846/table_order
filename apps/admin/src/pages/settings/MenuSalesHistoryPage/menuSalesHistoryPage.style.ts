import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';
import * as UIStyles from '@repo/ui/styles';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px 24px 24px 30px;
  flex: 1;
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
  width: 100%;
  margin-bottom: 12px;
`;

export const DateRange = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 15px;
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

export const SearchButton = styled.button`
  ${TYPOGRAPHY.ST_3}
  height: 40px;
  padding: 10px 16px;
  border-radius: 12px;
  border: 1px solid ${theme.colors.primary[600]};
  background-color: ${theme.colors.white};
  color: ${theme.colors.primary[700]};
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    color: ${theme.colors.grey[500]};
    border-color: ${theme.colors.grey[300]};
  }
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
  flex-wrap: wrap;
`;

export const CategoryFilter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid ${theme.colors.grey[200]};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 12px;
`;

export const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  ${TYPOGRAPHY.ST_3}
  color: ${theme.colors.grey[700]};
  border-bottom: 1px solid ${theme.colors.grey[200]};
  padding-bottom: 15px;
`;

export const CategoryChips = styled.div`
  padding-top: 10px;
  display: flex;
  align-items: center;
  gap: 15px;
`;

export const Chip = styled.button<{ selected: boolean }>`
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid
    ${({ selected }) =>
      selected ? theme.colors.primary[300] : theme.colors.grey[300]};
  background-color: ${({ selected }) =>
    selected ? theme.colors.primary[100] : theme.colors.grey[50]};
  color: ${({ selected }) =>
    selected ? theme.colors.primary[700] : theme.colors.grey[700]};
  ${TYPOGRAPHY.ST_5}
  cursor: pointer;
`;

export const SelectAll = css`
  ${TYPOGRAPHY.MT_7}
  color: ${theme.colors.grey[800]};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  > div {
    width: 22px;
    height: 22px;
  }
`;

export const TableCard = styled.div`
  border-radius: 12px;
`;

export const HeaderLabel = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  ${TYPOGRAPHY.ST_3}
  color: ${theme.colors.grey[600]};
`;

export const EmptyRow = styled.tr`
  td {
    padding: 16px 0;
    text-align: center !important;
    ${TYPOGRAPHY.ST_3}
    color: ${theme.colors.grey[500]};
  }
`;

export const SummaryRow = styled.tr`
  background-color: ${theme.colors.grey[100]};
  & > td {
    ${TYPOGRAPHY.ST_3}
    font-weight: 700;
    color: ${theme.colors.grey[800]};
  }
`;

export const TableRow = styled.tr<{ isOption?: boolean }>`
  ${({ isOption }) =>
    isOption &&
    `
    & > td {
      color: ${theme.colors.grey[700]};

    }
  `}

  & > td:first-of-type {
    padding-left: ${({ isOption }) => (isOption ? '5px' : '0')};
  }
`;

export const MenuName = styled.span<{ isOption?: boolean }>`
  ${({ isOption }) => (isOption ? TYPOGRAPHY.ST_5 : TYPOGRAPHY.ST_4)}
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

export const StyledTable = styled(UIStyles.setting.Table)`
  thead {
    & > tr > th:first-of-type {
      flex: 2;
      text-align: left;
      padding-left: 20px;
    }
    & > tr > th:not(:first-of-type) {
      flex: 1;
    }
  }

  tbody {
    & > tr > td:first-of-type {
      flex: 2;
      padding-left: 20px;
      text-align: left;
    }
    & > tr > td:not(:first-of-type) {
      flex: 1;
    }
  }
`;
