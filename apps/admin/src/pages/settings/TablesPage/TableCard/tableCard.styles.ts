import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';
const { colors } = theme;

interface TableCardProps {
  isSelected?: boolean;
}

export const TableCard = styled.div<TableCardProps>`
  background-color: ${({ isSelected }) => (isSelected ? colors.primary[500] : colors.grey[200])};
  color: ${({ isSelected }) => (isSelected ? colors.white : colors.grey[400])};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 12px;
  overflow: hidden;
  width: 190px;
  height: 154px;
  cursor: pointer;
`;

export const TableContent = styled.div`
  flex: 1;
  padding: 10px 12px 4px 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
export const TableNumber = styled.h1`
  ${TYPOGRAPHY.ST_3}
`;

export const TableName = styled.h1`
  ${TYPOGRAPHY.ST_3}
`;

export const TableStatus = styled.h1`
  text-align: right;
  ${TYPOGRAPHY.ST_3}
`;



