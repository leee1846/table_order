import styled from '@emotion/styled';
import { theme } from '@repo/ui';

export const MenuRow = styled.tr<{ hasOptions?: boolean }>`
  border-bottom: ${({ hasOptions }) =>
    hasOptions ? 'none' : `1px solid ${theme.colors.grey[200]}`} !important;
`;

export const OptionRow = styled.tr<{ isLast?: boolean }>`
  border-bottom: ${({ isLast }) =>
    isLast ? `1px solid ${theme.colors.grey[200]}` : 'none'} !important;
  padding: 0 6px !important;
  padding-bottom: ${({ isLast }) => (isLast ? '14px' : '0')} !important;

  & > td {
    color: ${theme.colors.grey[400]} !important;
  }
`;
