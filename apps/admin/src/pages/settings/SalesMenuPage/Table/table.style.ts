import styled from '@emotion/styled';
import { theme } from '@repo/ui';
import * as UIStyles from '@repo/ui/styles';

export const Tbody = styled(UIStyles.setting.Tbody)`
  padding-bottom: 60px;
`;

export const MenuRow = styled.tr<{ hasOptions?: boolean }>`
  ${({ hasOptions }) =>
    hasOptions
      ? 'border-bottom: none'
      : `border-bottom: 1px solid ${theme.colors.grey[200]}`}
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
