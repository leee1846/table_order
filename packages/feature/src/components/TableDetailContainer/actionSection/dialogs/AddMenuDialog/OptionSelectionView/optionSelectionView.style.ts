import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { theme, TYPOGRAPHY } from '@repo/ui';
import { RightPanel } from '../addMenuDialog.styles';

const { colors } = theme;

export const OptionContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  height: 100%;
`;

export const OptionLeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${colors.grey[50]};
  padding: 56px 45px;
  overflow-y: auto;
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
  gap: 40px;
`;

export const OptionGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px 50px;
`;

export const OptionGroupHeader = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  grid-column: 1 / -1;
  margin-bottom: 4px;
`;

export const OptionGroupName = styled.div`
  ${TYPOGRAPHY.ST_1}
  color: ${colors.grey[700]};
`;

export const OptionGroupInfo = styled.div`
  ${TYPOGRAPHY.ST_4}
  color: ${colors.semantic[400]};
`;

export const OptionRow = styled.div<{
  isDisabled: boolean;
}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const OptionName = styled.div`
  ${TYPOGRAPHY.MT_5}
  color: ${colors.grey[800]};
`;

export const OptionRightPanel = styled(RightPanel)`
  /* RightPanel 스타일 상속 */
`;

export const SelectedOptionsList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  ${TYPOGRAPHY.ST_4}
  color: ${colors.grey[500]};
`;

export const SelectedOptionItem = styled.div`
  padding-bottom: 12px;
  display: flex;
  gap: 5px;
`;

export const OptionItemName = styled.div``;

export const OptionItemPrice = styled.div``;

export const OptionItemQuantity = styled.div``;

export const optionQuantityInput = css`
  max-width: 50%;
  min-width: 50%;
`;

export const MenuQuantitySection = styled.div`
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const TotalMountSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid ${colors.grey[200]};
  padding: 24px 8px;
  gap: 8px;
  min-width: 0;
`;

export const TotalMountLabel = styled.div`
  ${TYPOGRAPHY.MT_2}
  color: ${colors.grey[800]};
  white-space: nowrap;
  flex-shrink: 0;
`;

export const TotalMountValue = styled.div`
  ${TYPOGRAPHY.MT_2}
  color: ${colors.primary[500]};
  min-width: 0;
  text-align: left;
  word-break: break-all;
  overflow-wrap: anywhere;
`;

export const rightPanelMenuQuantityInput = css`
  width: 100%;
  max-width: 100%;
  border-radius: 12px;
`;

export const checkboxCss = css`
  ${TYPOGRAPHY.MT_5}

  & > div {
    width: 30px;
    height: 30px;
  }
`;

export const radioCss = css`
  ${TYPOGRAPHY.MT_5}

  & > div {
    width: 30px;
    height: 30px;
  }

  > input {
    margin-left: 16px;
  }
`;
