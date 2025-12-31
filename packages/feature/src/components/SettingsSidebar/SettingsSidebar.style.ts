import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const Layout = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 30px;
  background-color: ${theme.colors.grey[800]};
  width: 100%;
  min-width: 13.125rem;
  max-width: 13.125rem;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  position: relative;
`;

export const Logo = styled.div`
  & > button {
    width: 100%;
    padding: 40px 20px 20px;
  }
`;

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-left: 16px;
  padding-bottom: 120px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

interface ICategoryButton {
  isSelected: boolean;
  isOpen?: boolean;
}
export const CategoryButton = styled.button<ICategoryButton>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;

  span {
    text-align: left;
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    ${TYPOGRAPHY.MT_6}
    color: ${({ isSelected }) =>
      isSelected ? theme.colors.white : theme.colors.grey[500]};
  }

  & > svg {
    transform-origin: center;
    transform: ${({ isOpen }) => (isOpen ? 'rotate(90deg)' : 'rotate(0deg)')};
    transition: transform 0.2s ease;
  }
`;

export const SubMenuList = styled.ul`
  padding-left: 10px;
`;

interface IDetailButton {
  isSelected: boolean;
}
export const DetailButton = styled.button<IDetailButton>`
  display: flex;
  align-items: center;
  width: 100%;
  text-align: left;
  padding: 10px 12px 10px 10px;
  border-radius: 0.5rem;

  span {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    ${TYPOGRAPHY.ST_4}
    color: ${({ isSelected }) =>
      isSelected ? theme.colors.primary[400] : theme.colors.grey[400]};
  }
`;

export const FloatingHomeButton = styled.button`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 24px 0;
  background-color: ${theme.colors.grey[900]};
  cursor: pointer;

  span {
    ${TYPOGRAPHY.MT_6}
    color: ${theme.colors.grey[600]};
  }
`;

export const Content = styled.main`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
`;
