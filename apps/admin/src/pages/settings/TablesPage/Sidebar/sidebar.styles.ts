import { SidebarContainer, Logo } from '@repo/ui/components';
import { theme, TYPOGRAPHY } from '@repo/ui';
import styled from '@emotion/styled';

const { colors } = theme;

export const Sidebar = styled(SidebarContainer)`
  position: relative;
  display: flex;
`;

export const SidebarLogo = styled(Logo)``;

export const TableGroupList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 15;
  overflow-y: auto;
`;
export const TableGroupItem = styled.li<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  cursor: pointer;
  ${TYPOGRAPHY.MT_4}
  color: ${({ isSelected }) =>
    isSelected ? colors.primary[500] : colors.grey[500]};
`;

export const AddGroupButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 24px 15px;
  flex: 1;
`;

export const AddGroupButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  white-space: nowrap;
  ${TYPOGRAPHY.ST_3}
  background-color: ${colors.grey[700]};
  padding: 10px 16px;
  border-radius: 12px;

  span {
    color: ${colors.white};
  }
`;

export const FloatingHomeButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 24px 0;
  background-color: ${colors.grey[900]};
  cursor: pointer;

  span {
    ${TYPOGRAPHY.MT_6}
    color: ${colors.grey[600]};
  }
`;
