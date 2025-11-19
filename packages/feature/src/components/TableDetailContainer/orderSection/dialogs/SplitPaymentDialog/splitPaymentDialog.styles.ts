import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';
import { BaseDialogContainer } from '../../../../shared/dialogStyles';
import { css } from '@emotion/react';

const { colors, spacing } = theme;

export const DialogContainer = styled(BaseDialogContainer)`
  width: ${spacing.dialogWidth['xlarge']};
  padding: 0;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 80vh;
`;

export const CloseButton = styled.div`
  text-align: right;
  cursor: pointer;
`;

export const LeftSection = styled.div`
  flex: 1.5;
  display: flex;
  flex-direction: column;
  padding: 24px 24px 54px 24px;
  background-color: ${colors.grey[50]};
`;

export const SectionTitle = styled.h3`
  ${TYPOGRAPHY.MT_1}
  color: ${colors.grey[800]};
  margin-bottom: 30px;
`;

export const OrderSheetSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

export const OrderSheetHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${colors.grey[200]};
`;

export const OrderSheetLabel = styled.span`
  ${TYPOGRAPHY.MT_6}
  color: ${colors.grey[700]};
`;

export const OrderItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const OrderItemRow = styled.div<{ $isSelected?: boolean }>`
  cursor: pointer;
  transition: background-color 0.2s;
  border-radius: 8px;
  padding: 8px;
  background-color: ${({ $isSelected }) =>
    $isSelected ? colors.grey[200] : 'transparent'};

  > div:nth-child(1) {
    display: flex;
    flex-direction: row;
    margin-bottom: 12px;
  }
`;

export const ItemName = styled.span`
  ${TYPOGRAPHY.MT_7}
  color: ${colors.grey[800]};
  text-align: left;
  flex: 3;
`;

export const ItemQty = styled.span`
  ${TYPOGRAPHY.MT_7}
  color: ${colors.grey[800]};
  text-align: center;
  flex: 1;
`;

export const ItemPrice = styled.span`
  ${TYPOGRAPHY.MT_7}
  color: ${colors.grey[800]};
  text-align: right;
  flex: 1;
`;

export const OptionRow = styled.div`
  display: flex;
  background-color: transparent;
  justify-content: space-between;
  &:not(:last-child) {
    margin-bottom: 8px;
  }
  > div {
    display: flex;
    flex-direction: row;
    color: ${colors.grey[500]};
    ${TYPOGRAPHY.ST_4}
  }
  > div:nth-child(1) {
    p {
      transform: translateY(-6px);
    }
  }

  > div:nth-child(2) {
    flex: 1;
    justify-content: flex-end;
    align-items: center;
    gap: 20px;
  }
`;

export const OptionName = styled.span``;

export const OptionQty = styled.p`
  text-align: center;
`;

export const OptionPrice = styled.span`
  text-align: right;
  min-width: 50px;
`;

export const PaymentRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 12px;
  padding: 12px;
`;

export const PaymentMethod = styled.span`
  ${TYPOGRAPHY.ST_4}
  color: ${colors.grey[600]};
`;

export const PaymentQty = styled.span`
  ${TYPOGRAPHY.ST_4}
  color: ${colors.grey[600]};
  text-align: center;
`;

export const PaymentAmount = styled.span<{ $isNegative?: boolean }>`
  ${TYPOGRAPHY.ST_4}
  color: ${({ $isNegative }) =>
    $isNegative ? colors.primary[500] : colors.grey[900]};
  text-align: right;
`;

export const RemainingAmountSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid ${colors.grey[200]};
  padding-top: 17px;
`;

export const RemainingLabel = styled.span`
  ${TYPOGRAPHY.MT_2}
  color: ${colors.grey[800]};
`;

export const RemainingAmount = styled.span`
  ${TYPOGRAPHY.MT_2}
  color: ${colors.primary[500]};
`;

export const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  justify-content: space-between;
`;

export const TopSection = styled.div`
  display: flex;
  flex-direction: column;
`;

export const AmountDisplay = styled.div<{ $isPlaceholder?: boolean }>`
  ${TYPOGRAPHY.MT_1}
  color: ${({ $isPlaceholder }) =>
    $isPlaceholder ? colors.primary[100] : colors.grey[900]};
  text-align: center;
  margin-top: 24px;
`;

export const KeypadWrapper = styled.div``;

export const Footer = styled.div`
  display: flex;
  gap: 12px;
`;

export const PaymentButtonStyle = css`
  flex: 1;
`;
