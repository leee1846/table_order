import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

const { colors } = theme;

export const MenuItemContainer = styled.div<{ isActive: boolean }>`
  ${TYPOGRAPHY.ST_3}
  padding: 12px 16px;
  color: ${({ isActive }) => (isActive ? colors.white : colors.grey[600])};
  background: ${({ isActive }) => (isActive ? colors.black : 'transparent')};
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: ${({ isActive }) =>
      isActive ? colors.black : colors.grey[800]};
    color: ${colors.white};
  }
`;
