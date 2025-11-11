import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';

const { colors } = theme;

export const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${colors.grey[900]};
  width: 200px;
  min-height: 100vh;
  padding: 16px;
  gap: 16px;
`;

export const SidebarHeader = styled.div`
  ${TYPOGRAPHY.ST_2}
  color: ${colors.white};
  padding: 8px 0;
  margin-bottom: 8px;
`;

export const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 4px;
`;

export const ActionButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid ${colors.grey[800]};
`;
