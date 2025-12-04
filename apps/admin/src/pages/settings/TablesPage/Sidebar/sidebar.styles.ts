import { SidebarContainer, Logo } from '@repo/ui/components';
import { theme, TYPOGRAPHY } from '@repo/ui';
import styled from '@emotion/styled';

const { colors } = theme;

export const Sidebar = styled(SidebarContainer)`
  position: relative;
  overflow: visible;
`;

export const SidebarLogo = styled(Logo)`
  flex-shrink: 0;
`;

export const TableGroupListWrapper = styled.div`
  flex: 1;
  min-height: 0;
  overflow: visible;
  position: relative;
  padding-left: 80px;
  margin-left: -80px;
`;

export const TableGroupList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
  padding: 0;
  margin: 0;
  height: 100%;
  padding-left: 80px;
  margin-left: -80px;
`;

export const TableGroupItemWrapper = styled.li`
  position: relative;
  list-style: none;
`;

export const EditDeleteButtons = styled.div<{
  buttonPosition?: 'default' | 'bottom' | 'top';
}>`
  display: flex;
  flex-direction: column;
  background-color: ${colors.grey[100]};
  border-radius: 30px;
  position: absolute;
  right: calc(100% - 8px);
  top: ${({ buttonPosition }) => {
    if (buttonPosition === 'bottom') return '0%'; // 첫 번째 항목: 항목 하단
    if (buttonPosition === 'top') return 'auto'; // 마지막 항목: bottom 사용
    return '50%'; // 기본: 항목 중앙
  }};
  // 마지막 항목일 때만 bottom 0 적용
  bottom: ${({ buttonPosition }) => (buttonPosition === 'top' ? '0' : 'auto')};
  /* 기본 위치일 때만 중앙 정렬 transform 적용 */
  transform: ${({ buttonPosition }) =>
    buttonPosition === 'default' ? 'translateY(-50%)' : 'none'};
  z-index: 10;
  white-space: nowrap;
`;

export const EditButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  padding: 14px 12px 10px 12px;
`;

export const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  padding: 12px 12px 14px 12px;
  border-top: 1px solid ${colors.grey[300]};
`;

export const TableGroupItem = styled.div<{ isSelected: boolean }>`
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
  flex-shrink: 0;
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
