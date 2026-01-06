import styled from '@emotion/styled';
import { TYPOGRAPHY } from '../theme/typography';
import { theme } from '../index';

const { colors } = theme;

export const SidebarContainer = styled.aside`
  display: flex;
  flex-direction: column;
  background-color: ${colors.grey[800]};
  height: 100vh;
  width: 140px;
  overflow: auto;
`;

export const Logo = styled.div`
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
`;

export const MenuDivider = styled.div`
  height: 1px;
  background-color: ${colors.grey[700]};
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
    isSelected ? colors.primary[500] : colors.grey[500]};
`;

export const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 12px;
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
