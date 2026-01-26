import styled from '@emotion/styled';
import { theme } from '@repo/ui';

export {
  PageWrapper,
  Container,
  TitleContainer,
  Title,
  ButtonGroup,
} from '@/feature/AdminWeb/styles/formPage.styles';

export const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1px solid ${theme.colors.grey[300]};
`;

export const TabButton = styled.button<{ isActive: boolean }>`
  padding: 12px 24px;
  border: none;
  border-bottom: 2px solid
    ${({ isActive }) =>
      isActive ? theme.colors.primary[500] : 'transparent'};
  background: none;
  color: ${({ isActive }) =>
    isActive ? theme.colors.primary[500] : theme.colors.grey[600]};
  font-size: 14px;
  font-weight: ${({ isActive }) => (isActive ? 500 : 400)};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: ${theme.colors.primary[500]};
    background-color: ${theme.colors.primary[100]};
  }
`;

export const TabContent = styled.div`
  min-height: 400px;
`;
