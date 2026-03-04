import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  padding: 24px;
  background-color: ${theme.colors.white};
  border-radius: 1rem;
  width: 60rem;
  max-height: 700px;

  > button {
    cursor: pointer;
    width: 100%;
    text-align: right;
  }
`;

export const Header = styled.div`
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Title = styled.h1`
  ${TYPOGRAPHY.MT_1}
  color: ${theme.colors.grey[800]};
`;

export const TableName = styled.div`
  ${TYPOGRAPHY.MT_6}
  color: ${theme.colors.grey[700]};
  display: flex;
  align-items: center;
  ${TYPOGRAPHY.CT_2}
  border: 0.5px solid ${theme.colors.grey[400]};
  padding: 6px 10px;
  border-radius: 1999px;
  gap: 2px;
`;

export const Tab = styled.div`
  overflow: hidden;
  margin-bottom: 24px;
`;

export const TabButton = styled.button<{ isSelected: boolean }>`
  width: 10.21875rem;
  height: 3.125rem;
  border-bottom: ${({ isSelected }) =>
    isSelected
      ? `4px solid ${theme.colors.primary[600]}`
      : `2px solid ${theme.colors.grey[400]}`};
  color: ${({ isSelected }) =>
    isSelected ? theme.colors.grey[900] : theme.colors.grey[500]};
  ${TYPOGRAPHY.ST_1}
`;
