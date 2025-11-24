import styled from '@emotion/styled';
import { baseTheme, TYPOGRAPHY } from '@repo/ui';

export const Container = styled.aside`
  position: fixed;
  top: 4.75rem;
  bottom: 0;
  left: 0;
  width: 13.125rem;
  height: calc(100vh - 4.75rem);
  background-color: ${baseTheme.darkModeColors.grey[100]};
  padding: 20px 0 130px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  z-index: ${({ theme }) => theme.zIndex.base};
`;

export const CategoryButton = styled.button<{
  isActive: boolean;
}>`
  padding: 14px 20px 14px 30px;
  background-color: ${({ isActive }) =>
    isActive
      ? baseTheme.darkModeColors.background[100]
      : baseTheme.darkModeColors.grey[100]};
  color: ${({ isActive }) =>
    isActive
      ? baseTheme.colors.primary[500]
      : baseTheme.darkModeColors.grey[600]};
  border-right: 8px solid
    ${({ isActive }) =>
      isActive ? baseTheme.colors.primary[500] : 'transparent'};
  ${TYPOGRAPHY.MT_5}
  text-align: left;
`;

export const StaffCall = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 13.125rem;
  padding: 20px 12px 40px;
  background-color: ${baseTheme.darkModeColors.grey[100]};

  & > button {
    width: 100%;
    padding: 18px;
    background-color: ${baseTheme.colors.grey[900]};
    border-bottom: 1px solid ${baseTheme.colors.grey[700]};
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    color: ${baseTheme.colors.white};
    ${TYPOGRAPHY.MT_7}
  }
`;
