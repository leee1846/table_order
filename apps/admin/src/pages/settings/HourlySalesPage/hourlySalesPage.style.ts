import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

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
  flex-wrap: wrap;
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

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
  flex-wrap: wrap;
`;

export const TableCard = styled.div``;

export const HeaderLabel = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  ${TYPOGRAPHY.ST_3}
  color: ${theme.colors.grey[600]};
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

  span {
    ${TYPOGRAPHY.CT_3}
    color: ${theme.colors.grey[600]};
  }
`;

export const EmptyRow = styled.tr`
  td {
    padding: 16px 0;
    text-align: center;
    ${TYPOGRAPHY.ST_3}
    color: ${theme.colors.grey[500]};
  }
`;
