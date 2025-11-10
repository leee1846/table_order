import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';
import { Link } from 'react-router-dom';

export const Layout = styled.div`
  display: flex;
  height: 100vh;
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 30px;
  background-color: ${({ theme }) => theme.colors.grey[800]};
  width: 210px;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
`;

interface LinkItemProps {
  isSelected: boolean;
}
export const LinkItem = styled(Link)<LinkItemProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;

  span {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    ${TYPOGRAPHY.MT_6}
    color: ${({ theme, isSelected }) =>
      isSelected ? theme.colors.white : theme.colors.grey[500]};
  }
`;

export const Content = styled.main`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 40px 24px 40px 30px;
`;
