import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { theme, TYPOGRAPHY } from '@repo/ui';
import { RightPanel } from '../addMenuDialog.styles';

const { colors } = theme;

export const OptionContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  height: 100%;
`;

export const OptionLeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${colors.grey[50]};
  padding: 56px 45px 0 45px;
  overflow: hidden;
`;

export const OptionHeader = styled.div`
  margin-bottom: 40px;
`;

export const OptionMenuName = styled.h2`
  ${TYPOGRAPHY.MT_1}
  color: ${colors.grey[800]};
`;

export const OptionListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const OptionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const OptionGroupHeader = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

export const OptionGroupName = styled.div`
  ${TYPOGRAPHY.ST_1}
  color: ${colors.grey[700]};
`;

export const OptionGroupInfo = styled.div`
  ${TYPOGRAPHY.ST_4}
  color: ${colors.semantic[400]};
`;

export const OptionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
`;

export const OptionName = styled.div<{
  isSelected: boolean;
  isDisabled: boolean;
}>`
  ${TYPOGRAPHY.ST_4}
  color: ${({ isSelected, isDisabled }) =>
    isDisabled
      ? colors.grey[400]
      : isSelected
        ? colors.primary[500]
        : colors.grey[800]};
  flex: 1;
`;

export const EmptyOptionText = styled.div`
  ${TYPOGRAPHY.ST_4}
  color: ${colors.grey[500]};
  text-align: center;
  padding: 40px 0;
`;

export const OptionRightPanel = styled(RightPanel)`
  /* RightPanel 스타일 상속 */
`;

export const SelectedOptionsList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SelectedOptionItem = styled.div`
  background-color: ${colors.white};
  border-radius: 8px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const OptionItemName = styled.div`
  ${TYPOGRAPHY.ST_4}
  color: ${colors.grey[800]};
`;

export const OptionItemQuantity = styled.div`
  ${TYPOGRAPHY.ST_4}
  color: ${colors.grey[700]};
`;

export const rightPanelQuantityInput = css`
  width: 100%;
  border-radius: 12px;
`;

export const MenuQuantitySection = styled.div`
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const rightPanelMenuQuantityInput = css`
  width: 100%;
  border-radius: 12px;
`;
