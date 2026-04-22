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
  margin-bottom: 12px;
`;

export const Dropdown = css`
  > ul {
    overflow-x: hidden;
  }
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

export const CategoryInfoWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
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
      color: ${theme.colors.grey[500]} !important;
      font-size : 13px !important;
      >span{
        font-size : 13px !important;
        padding-left: 10px !important;      
      }
        &:last-child{
          padding-right: 5px !important;
        }
    }
  `}

  & > td:first-of-type {
    padding-left: ${({ isOption }) => (isOption ? '5px' : '0')};
  }
`;

export const MenuName = styled.span<{ isOption?: boolean }>`
  ${({ isOption }) => (isOption ? TYPOGRAPHY.ST_5 : TYPOGRAPHY.ST_4)}
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
