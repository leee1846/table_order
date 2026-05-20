import styled from '@emotion/styled';
import { TYPOGRAPHY } from '../theme/typography';
import { theme } from '../index';

const { colors } = theme;

export const SidebarContainer = styled.aside`
  display: flex;
  flex-direction: column;
  background-color: ${colors.white};
  height: 100vh;
  width: 140px;
  overflow: auto;
  border-right: 2px solid ${colors.grey[200]};
`;

export const Logo = styled.button`
  color: ${colors.white};
  padding: 40px 12px 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  & > img {
    width: 100%;
  }
`;

export const MenuList = styled.ul`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0 12px;
  margin-top: 40px;
`;

export interface IMenuItem {
  isSelected: boolean;
}

export const MenuItem = styled.li<IMenuItem>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  cursor: pointer;

  ${TYPOGRAPHY.MT_4}
  color: ${({ isSelected }) =>
    isSelected ? colors.primary[600] : colors.grey[600]};
`;

export const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  margin-top: 30px;
`;

export const ActionButton = styled.button`
  padding: 12px;
  border: none;
  cursor: pointer;
  ${TYPOGRAPHY.MT_4}
  color: ${colors.grey[500]};
`;

export const Line = styled.div`
  width: 75%;
  height: 1px;
  background-color: ${colors.grey[700]};
`;
