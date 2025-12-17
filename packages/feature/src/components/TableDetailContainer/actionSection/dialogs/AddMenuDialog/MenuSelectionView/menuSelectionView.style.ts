import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';

const { colors } = theme;

export const ContentWrapper = styled.div`
  display: flex;
  height: 100%;
`;

export const Sidebar = styled.div`
  flex: 1;
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  background-color: ${colors.grey[200]};
`;

export const CategoryItem = styled.button<{ isActive: boolean }>`
  text-align: center;
  ${TYPOGRAPHY.MT_4}
  color: ${({ isActive }) =>
    isActive ? colors.primary[500] : colors.grey[700]};
  cursor: pointer;
  padding: 8px 0;
`;

export const MenuGrid = styled.div`
  flex: 4.5;
  background-color: ${colors.grey[50]};
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  overflow-y: auto;
  padding: 24px;
  align-content: start;
`;

export const MenuCard = styled.div<{ isSelected: boolean }>`
  background-color: ${colors.white};
  border: 1px solid ${colors.grey[200]};
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.08);
  height: 154px;
`;

export const MenuGridPlaceholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.grey[500]};
  ${TYPOGRAPHY.MT_7}
`;

export const MenuTitle = styled.div`
  ${TYPOGRAPHY.MT_7}
  color: ${colors.grey[800]};
`;

export const MenuPrice = styled.div`
  ${TYPOGRAPHY.MT_7}
  color: ${colors.grey[700]};
  text-align: right;
`;

export const SelectedItemsList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SelectedItem = styled.div`
  background-color: ${colors.white};
  border-radius: 8px;
  padding: 8px 8px 18px 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  border-bottom: 1px solid ${colors.grey[200]};
`;

export const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ItemName = styled.div`
  ${TYPOGRAPHY.MT_7}
  color: ${colors.grey[800]};
`;

export const ItemPrice = styled.div`
  ${TYPOGRAPHY.MT_7}
  color: ${colors.grey[700]};
`;

export const SelectedOptionsContainer = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const SelectedOptionItem = styled.div`
  padding-left: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const OptionItemName = styled.div`
  ${TYPOGRAPHY.ST_4}
  color: ${colors.grey[500]};
`;

export const OptionItemPrice = styled.div`
  ${TYPOGRAPHY.ST_5}
  color: ${colors.grey[600]};
`;

export const ItemActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 12px;
  margin-top: 18px;
`;

export const DeleteButton = styled.button`
  width: 32px;
  height: 32px;
  background-color: ${colors.grey[200]};
  border: none;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;

  &:hover {
    background-color: ${colors.grey[300]};
  }

  &:active {
    background-color: ${colors.grey[400]};
  }
`;

export const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${colors.grey[300]};
  padding: 4px 0;
  border-radius: 12px;
  overflow: hidden;
  background-color: ${colors.white};
  height: 52px;
`;

export const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background-color: ${colors.white};
  color: ${colors.grey[700]};

  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  &:disabled {

  &:hover {
    background-color: ${colors.grey[50]};
  }

  &:active {
    background-color: ${colors.grey[100]};
  }
`;

export const QuantityValue = styled.div`
  min-width: 40px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${TYPOGRAPHY.MT_6}
  color: ${colors.grey[800]};
`;

export const ItemDivider = styled.div`
  height: 1px;
  background-color: ${colors.grey[300]};
  margin: 8px 0;
`;

export const ItemTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TotalLabel = styled.div`
  ${TYPOGRAPHY.ST_4}
  color: ${colors.grey[800]};
`;

export const TotalPrice = styled.div`
  ${TYPOGRAPHY.ST_4}
  color: ${colors.primary[500]};
  font-weight: 700;
`;
