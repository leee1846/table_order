import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
`;

const { colors } = theme;

export const TableArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${colors.grey[600]};
  overflow-y: auto;
`;

export const TableGroupWrapper = styled.div`
  width: 100%;
  background-color: ${colors.white};
  padding: 12px 0 0 12px;
`;

export const TableGroupList = styled.div`
  display: flex;
  flex-direction: row;
  overflow: auto;
`;

export const TableGroup = styled.div`
  width: 140px;
  height: 54px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TableGroupButton = styled.button<{ isSelected: boolean }>`
  width: 100%;
  min-width: 0;
  height: 100%;
  box-sizing: border-box;
  padding: 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${TYPOGRAPHY.MT_8}
  color: ${({ isSelected }) =>
    isSelected ? colors.grey[900] : colors.grey[500]};
  border-bottom: ${({ isSelected }) =>
    isSelected ? `4px solid ${colors.primary[600]}` : `4px solid transparent`};
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 190px);
  grid-auto-rows: 154px;
  gap: 12px;
  justify-content: start;
  align-content: start;
  width: 100%;
  height: 100%;
  padding: 100px;
  overflow-y: auto;
`;
