import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const DateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 12px;
  border: 0.5px solid ${theme.colors.grey[300]};
  background-color: ${theme.colors.white};
  cursor: pointer;
`;

export const DateText = styled.span<{ $isPlaceholder?: boolean }>`
  ${TYPOGRAPHY.ST_5}
  color: ${({ $isPlaceholder }) =>
    $isPlaceholder ? theme.colors.grey[500] : theme.colors.grey[900]};
`;
