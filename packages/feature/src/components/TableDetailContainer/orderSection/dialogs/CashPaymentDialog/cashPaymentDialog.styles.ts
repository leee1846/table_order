import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';
import {
  DialogContainer as BaseDialogContainer,
  CloseButton as BaseCloseButton,
} from '../../../shared/dialogStyles';
import { css } from '@emotion/react';

const { colors, spacing } = theme;

export const DialogContainer = styled(BaseDialogContainer)`
  width: ${spacing.dialogWidth['large']};
  padding: 0;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 80vh;
`;

export const CloseButton = BaseCloseButton;

export const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  background-color: ${colors.grey[50]};
`;

export const RightSection = styled.div`
  flex: 1.5;
  display: flex;
  flex-direction: column;
  padding: 24px;
  justify-content: space-between;
`;

export const SectionTitle = styled.h3<{ $variant?: 'left' | 'right' }>`
  ${TYPOGRAPHY.MT_1}
  color: ${colors.grey[800]};
  ${({ $variant }) =>
    $variant === 'left' &&
    css`
      margin-bottom: 30px;
    `}
  ${({ $variant }) =>
    $variant === 'right' &&
    css`
      margin-top: 20px;
      text-align: center;
    `}
`;

export const PaymentInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  background-color: ${colors.grey[50]};
  margin-bottom: 24px;
`;

export const PaymentInfoLabel = styled.span`
  ${TYPOGRAPHY.ST_3}
  color: ${colors.grey[600]};
`;

export const PaymentInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const PaymentLabel = styled.span`
  ${TYPOGRAPHY.ST_4}
  color: ${colors.grey[500]};
`;

export const PaymentAmount = styled.span`
  ${TYPOGRAPHY.MT_7}
  color: ${colors.primary[500]};
`;

export const ReceivedAmount = styled.span`
  ${TYPOGRAPHY.MT_7}
  color: ${colors.grey[800]};
`;

export const ChangeSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid ${colors.grey[200]};
  padding-top: 4px;
`;

export const ChangeLabel = styled.span`
  ${TYPOGRAPHY.ST_4}
  color: ${colors.grey[500]};
`;

export const ChangeAmount = styled.span`
  ${TYPOGRAPHY.MT_7}
  color: ${colors.grey[800]};
`;

export const TopSection = styled.div`
  display: flex;
  flex-direction: column;
`;

export const AmountDisplay = styled.div<{ $isPlaceholder: boolean }>`
  ${TYPOGRAPHY.MT_1}
  color: ${({ $isPlaceholder }) =>
    $isPlaceholder ? colors.primary[100] : colors.grey[900]};
  text-align: center;
  margin-top: 24px;
`;

export const KeypadWrapper = styled.div``;

export const Footer = styled.div``;
