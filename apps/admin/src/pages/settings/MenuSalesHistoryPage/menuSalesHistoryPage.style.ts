import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 40px 24px 24px 30px;
  flex: 1;
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

export const FilterBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const DateRange = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const DateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 0.5px solid ${theme.colors.grey[300]};
  background-color: ${theme.colors.white};
  cursor: pointer;
  min-width: 200px;
`;

export const DateText = styled.span`
  ${TYPOGRAPHY.ST_2}
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
`;

export const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  ${TYPOGRAPHY.ST_3}
  color: ${theme.colors.grey[700]};
`;

export const CategoryChips = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const Chip = styled.button<{ selected: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid
    ${({ selected }) =>
      selected ? theme.colors.primary[500] : theme.colors.grey[300]};
  background-color: ${({ selected }) =>
    selected ? theme.colors.primary[50] : theme.colors.grey[50]};
  color: ${({ selected }) =>
    selected ? theme.colors.primary[700] : theme.colors.grey[700]};
  ${TYPOGRAPHY.CT_2}
  cursor: pointer;
`;

export const SelectAll = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  ${TYPOGRAPHY.ST_3}
  color: ${theme.colors.grey[800]};
  cursor: pointer;

  input {
    width: 16px;
    height: 16px;
  }
`;

export const TableCard = styled.div`
  background-color: ${theme.colors.grey[50]};
  border-radius: 12px;
  border: 1px solid ${theme.colors.grey[200]};
  padding: 12px;
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
    text-align: center;
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
