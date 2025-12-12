import styled from '@emotion/styled';
import { baseTheme, TYPOGRAPHY } from '@repo/ui';

export const Container = styled.aside`
  position: fixed;
  top: 4.75rem;
  bottom: 0;
  left: 0;
  width: 13.125rem;
  height: calc(100vh - 4.75rem);
  background-color: ${({ theme }) => theme.mode.undefined_palette[600]};
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  z-index: ${({ theme }) => theme.zIndex.base};
`;

export const CategoryButton = styled.button<{
  isActive: boolean;
}>`
  padding: 14px 20px 14px 30px;
  text-align: left;
  background-color: ${({ isActive, theme }) =>
    isActive ? '#0D0D0D' : theme.mode.undefined_palette[600]};
  color: ${({ isActive }) =>
    isActive
      ? baseTheme.colors.primary[500]
      : baseTheme.darkModeColors.grey[600]};
  border-right: 8px solid
    ${({ isActive }) =>
      isActive ? baseTheme.colors.primary[500] : 'transparent'};
  ${TYPOGRAPHY.MT_5}
`;

export const FloatingContainer = styled.div`
  position: sticky;
  bottom: 0;
  width: 100%;
  background-color: ${({ theme }) => theme.mode.undefined_palette[600]};
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 20px 12px 40px;
`;

export const StaffCall = styled.div`
  width: 100%;

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

    & > img {
      width: 30px;
      height: 30px;
    }
  }
`;

export const Language = styled.div`
  width: 100%;

  & > button {
    width: 100%;
    padding: 18px;
    background-color: ${baseTheme.colors.grey[800]};
    border-bottom: 1px solid ${baseTheme.colors.grey[700]};
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: ${baseTheme.colors.grey[400]};
    ${TYPOGRAPHY.ST_4}

    & > img {
      width: 30px;
      height: 30px;
    }
  }
`;
