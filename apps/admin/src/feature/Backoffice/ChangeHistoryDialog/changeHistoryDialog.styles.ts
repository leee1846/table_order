import styled from '@emotion/styled';
import { BaseDialogContainer } from '@repo/feature/components';
import { theme } from '@repo/ui';

export const DialogContainer = styled(BaseDialogContainer)`
  width: 800px;
  max-width: 90vw;
  max-height: 85vh;
  padding: 0;
`;

export const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

export const CloseButton = styled.button`
  cursor: pointer;
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.7;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const Title = styled.div`
  color: ${theme.colors.grey[900]};
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.5;
`;

export const TabContainer = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: 20px;
  border-bottom: 1px solid ${theme.colors.grey[200]};
`;

export const TabButton = styled.button<{ isActive: boolean }>`
  padding: 8px 16px;
  border: none;
  border-bottom: 2px solid
    ${({ isActive }) =>
      isActive ? theme.colors.primary[500] : 'transparent'};
  background: none;
  color: ${({ isActive }) =>
    isActive ? theme.colors.primary[500] : theme.colors.grey[600]};
  font-size: 14px;
  font-weight: ${({ isActive }) => (isActive ? 600 : 400)};
  letter-spacing: -0.005em;
  line-height: 1.5;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: ${theme.colors.primary[500]};
  }
`;

export const TableContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
  border: 1px solid ${theme.colors.grey[200]};
  border-radius: 6px;
  background: ${theme.colors.white};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${theme.colors.white};
`;

export const Thead = styled.thead`
  background-color: ${theme.colors.grey[50]};
  position: sticky;
  top: 0;
  z-index: 10;
`;

export const Tbody = styled.tbody`
  background-color: ${theme.colors.white};
`;

export const Tr = styled.tr`
  border-bottom: 1px solid ${theme.colors.grey[200]};

  &:last-child {
    border-bottom: none;
  }
`;

export const Th = styled.th`
  padding: 10px 16px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.grey[600]};
  letter-spacing: 0.01em;
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-bottom: 1px solid ${theme.colors.grey[200]};
  text-transform: uppercase;

  &:first-of-type {
    padding-left: 20px;
  }

  &:last-of-type {
    padding-right: 20px;
  }
`;

export const Td = styled.td`
  padding: 8px 16px;
  text-align: center;
  font-size: 13px;
  font-weight: 400;
  color: ${theme.colors.grey[900]};
  letter-spacing: -0.005em;
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:first-of-type {
    padding-left: 20px;
  }

  &:last-of-type {
    padding-right: 20px;
  }
`;
