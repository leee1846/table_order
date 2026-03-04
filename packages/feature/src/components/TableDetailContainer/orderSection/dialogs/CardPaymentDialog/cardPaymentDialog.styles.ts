import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { theme, TYPOGRAPHY } from '@repo/ui';
import {
  BaseDialogContainer,
  BaseCloseButton,
  BaseHeader,
  BaseTitle,
} from '../../../../shared/dialogStyles';

const { colors, zIndex, spacing } = theme;

export const DialogContainer = styled(BaseDialogContainer)`
  width: ${spacing.dialogWidth.xsmall};
  overflow: visible;
`;

export const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const CloseButton = BaseCloseButton;

export const Header = styled(BaseHeader)`
  margin-bottom: 40px;
`;

export const Title = styled(BaseTitle)``;

export const PaymentInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  background-color: ${colors.grey[50]};
  border-radius: 12px;
  margin-bottom: 40px;
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
  ${TYPOGRAPHY.MT_4}
  color: ${colors.primary[500]};
`;

export const InstallmentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
`;

export const InstallmentLabel = styled.label`
  ${TYPOGRAPHY.BD_2}
  color: ${colors.grey[700]};
`;

export const DropdownStyle = css`
  width: 100%;
  margin-bottom: 40px;

  & > button {
    width: 100%;
    background-color: ${colors.grey[50]};
    ${TYPOGRAPHY.ST_4}
  }

  & > ul {
    width: 100%;
    left: 0 !important;
    right: auto !important;
    z-index: ${zIndex.popover};
  }
`;

export const Footer = styled.div`
  display: flex;
  gap: 12px;
  padding-top: 8px;
`;

export const ConfirmButtonStyle = css`
  flex: 1;
`;
