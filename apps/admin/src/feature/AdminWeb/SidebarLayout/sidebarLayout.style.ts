import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const Layout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;

export const Navbar = styled.nav`
  display: flex;
  align-items: center;
  background-color: ${theme.colors.white};
  border-bottom: 1px solid ${theme.colors.grey[200]};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  z-index: 600;
  position: relative;
`;

export const NavbarContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 32px;
  height: 64px;
  gap: 40px;
`;

export const Logo = styled.div`
  width: 100px;

  & > img {
    width: 100%;
  }
`;

export const NavMenu = styled.ul`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const NavMenuItem = styled.li`
  position: relative;
`;

interface ICategoryButton {
  isSelected: boolean;
  isOpen?: boolean;
}
export const CategoryButton = styled.button<ICategoryButton>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 16px;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  position: relative;

  span {
    ${TYPOGRAPHY.BD_2}
    color: ${({ isSelected }) =>
      isSelected ? theme.colors.grey[900] : theme.colors.grey[700]};
    font-weight: ${({ isSelected }) => (isSelected ? 600 : 500)};
    white-space: nowrap;
    transition: color 0.2s ease;
  }

  & > svg {
    transform-origin: center;
    transform: ${({ isOpen }) => (isOpen ? 'rotate(90deg)' : 'rotate(0deg)')};
    transition: transform 0.1s ease;
    flex-shrink: 0;
  }

  &:hover {
    span {
      color: ${theme.colors.grey[900]};
    }

    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 50%;
      transform: translateX(-50%);
      width: calc(100% - 32px);
      height: 2px;
      background-color: ${theme.colors.primary[500]};
      border-radius: 2px 2px 0 0;
    }
  }

  &:active {
    background-color: ${theme.colors.grey[100]};
  }

  ${({ isSelected }) =>
    isSelected &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 50%;
      transform: translateX(-50%);
      width: calc(100% - 32px);
      height: 2px;
      background-color: ${theme.colors.primary[500]};
      border-radius: 2px 2px 0 0;
    }
  `}
`;

export const DropdownMenu = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.grey[200]};
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  padding: 6px;
  min-width: 200px;
  list-style: none;
  margin: 0;
  z-index: 1001;
  animation: fadeIn 0.15s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const DropdownMenuItem = styled.li`
  margin: 0;
`;

interface IDetailButton {
  isSelected: boolean;
}
export const DetailButton = styled.button<IDetailButton>`
  display: flex;
  align-items: center;
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border-radius: 4px;
  background: ${({ isSelected }) =>
    isSelected ? theme.colors.primary[100] : 'transparent'};
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;

  span {
    ${TYPOGRAPHY.MT_3}
    color: ${({ isSelected }) =>
      isSelected ? theme.colors.primary[700] : theme.colors.grey[700]};
    font-weight: ${({ isSelected }) => (isSelected ? 500 : 400)};
    white-space: nowrap;
  }

  &:hover {
    background-color: ${({ isSelected }) =>
      isSelected ? theme.colors.primary[100] : theme.colors.grey[50]};

    span {
      color: ${({ isSelected }) =>
        isSelected ? theme.colors.primary[700] : theme.colors.grey[900]};
    }
  }

  &:active {
    background-color: ${({ isSelected }) =>
      isSelected ? theme.colors.primary[100] : theme.colors.grey[100]};
  }
`;

export const DownloadLink = styled.a`
  ${TYPOGRAPHY.BD_3}
  color: ${theme.colors.grey[700]};
  text-decoration: none;
  padding: 10px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-weight: 500;

  &:hover {
    color: ${theme.colors.grey[900]};
    background-color: ${theme.colors.grey[50]};
  }

  &:active {
    background-color: ${theme.colors.grey[100]};
  }
`;

export const Content = styled.main`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  gap: 32px;
  padding: 32px 40px;
  max-width: 1400px;
  margin: 0 auto;
`;
