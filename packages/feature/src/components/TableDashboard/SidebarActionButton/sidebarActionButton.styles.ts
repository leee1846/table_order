import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';
const { colors } = theme;

export const ActionButtonContainer = styled.button`
  ${TYPOGRAPHY.BD_2}
  padding: 12px 16px;
  background: ${colors.grey[800]};
  color: ${colors.grey[300]};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
  width: 100%;

  &:hover {
    background: ${colors.grey[700]};
    color: ${colors.white};
  }

  &:active {
    background: ${colors.grey[600]};
  }
`;
