import { css } from '@emotion/react';
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

export const Filters = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
`;

export const FilterBtn = css`
  margin-left: 10px;
`;

export const Section = styled.section`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${TYPOGRAPHY.MT_5}
  color: ${theme.colors.grey[900]};
`;

export const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
`;

export const Card = styled.div`
  border: 1px solid ${theme.colors.grey[200]};
  border-radius: 12px;
  padding: 14px;
  background-color: ${theme.colors.grey[50]};
  display: flex;
  flex-direction: column;
  gap: 6px;
  border: 1px solid red;
`;

export const CardLabel = styled.span`
  ${TYPOGRAPHY.CT_2}
  color: ${theme.colors.grey[600]};
`;

export const CardValue = styled.span`
  ${TYPOGRAPHY.MT_4}
  color: ${theme.colors.grey[900]};
`;

export const TableWrapper = styled.div`
  border: 1px solid ${theme.colors.grey[200]};
`;
