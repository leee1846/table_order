import styled from '@emotion/styled';
import {
  BaseDialogContainer,
  BaseHeader,
  BaseTitle,
} from '@repo/feature/components';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const DialogContainer = styled(BaseDialogContainer)`
  width: 90vw;
  height: 90vh;
  padding: 0;
`;

export const Container = styled.div`
  padding: 24px 24px 0 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

export const CloseButton = styled.button`
  cursor: pointer;
  text-align: right;
  transform: translate(-24px, 24px);
  background: none;
  border: none;
  padding: 0;
`;

export const Header = styled(BaseHeader)`
  justify-content: space-between;
  margin-bottom: 24px;
`;

export const Title = BaseTitle;

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
  ${TYPOGRAPHY.ST_1}
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: ${theme.colors.primary[500]};
    background-color: ${theme.colors.primary[100]};
  }
`;

export const TableContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;
