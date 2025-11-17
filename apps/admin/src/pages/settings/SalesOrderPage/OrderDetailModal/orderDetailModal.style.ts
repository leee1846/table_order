import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  padding: 24px;
  background-color: ${theme.colors.white};
  border-radius: 1rem;
  width: 60rem;
`;

export const Tab = styled.div`
  padding: 4px;
  border-radius: 62.4rem;
  background-color: ${theme.colors.grey[200]};
  width: fit-content;
  overflow: hidden;
  margin-bottom: 24px;
`;

export const TabButton = styled.button<{ isSelected: boolean }>`
  width: 10.21875rem;
  height: 3.125rem;
  border-radius: 62.4rem;
  background-color: ${({ isSelected }) =>
    isSelected ? theme.colors.primary[600] : theme.colors.grey[200]};
  color: ${({ isSelected }) =>
    isSelected ? theme.colors.white : theme.colors.grey[700]};
  ${TYPOGRAPHY.ST_1}
`;
