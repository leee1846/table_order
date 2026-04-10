import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';
import {
  SidebarContainer as UISidebarContainer,
  Logo as UILogo,
  MenuList as UIMenuList,
  MenuItem as UIMenuItem,
} from '@repo/ui/components';

const { zIndex, colors } = theme;

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  border-radius: 0;
  display: flex;
  flex-direction: row;
  overflow-y: auto;
  z-index: ${zIndex.modal};
`;

export const Layout = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const TableArea = styled.div`
  flex: 1;
  display: flex;
  background: ${theme.colors.grey[600]};
  overflow: auto;
  padding: 100px;
`;

export const TableGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 190px);
  grid-auto-rows: 154px;
  gap: 12px;
  justify-content: start;
  align-content: start;
  width: 100%;
  height: 100%;
`;

export const TableCard = styled.button<{ selected: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 14px 12px;
  background: ${({ selected }) =>
    !selected ? theme.colors.primary[500] : theme.colors.grey[200]};
  color: ${({ selected }) =>
    !selected ? theme.colors.white : theme.colors.grey[400]};
  border-radius: 12px;

  cursor: pointer;
  text-align: left;
  min-height: 120px;
`;

export const TableNumber = styled.span`
  ${TYPOGRAPHY.ST_3}
`;

export const TableStatus = styled.span`
  ${TYPOGRAPHY.ST_3}
  text-align: right;
`;

export const ActionBar = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow:
    0 4px 4px 0 rgba(0, 0, 0, 0.08),
    0 0 2px 0 rgba(0, 0, 0, 0.16);
  background: rgba(0, 0, 0, 0.76);
  border-radius: 999px;

  button {
    color: ${colors.grey[200]};
    ${TYPOGRAPHY.MT_6};
    padding: 20px 40px;
    white-space: nowrap;
    flex: 1;
    min-width: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  button:not(:last-of-type) {
    position: relative;

    &:after {
      position: absolute;
      content: '';
      display: block;
      width: 1px;
      height: 60%;
      background: ${colors.grey[600]};
      top: 20%;
      right: 0;
    }
  }
`;

export const SidebarContainer = styled(UISidebarContainer)`
  padding-bottom: 20px;
`;

export const Logo = styled(UILogo)``;

export const MenuList = styled(UIMenuList)`
  overflow: auto;
`;

export const MenuItem = styled(UIMenuItem)``;
