import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { theme, TYPOGRAPHY, type Theme } from '@repo/ui';
import {
  BaseDialogContainer,
  BaseCloseButton,
  BaseTitle,
} from '@repo/feature/components';

const { typography, zIndex, spacing } = theme;

export const DialogContainer = styled(BaseDialogContainer)`
  width: ${spacing.dialogWidth.xsmall};
  overflow: visible;
  background-color: ${({ theme }) => theme.mode.undefined_palette[200]};
`;

export const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const CloseButton = styled(BaseCloseButton)`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const Title = styled(BaseTitle)`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.mode.grey[900]};
`;

export const PaymentInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  background-color: ${({ theme }) => theme.mode.grey[100]};
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
  color: ${({ theme }) => theme.mode.grey[700]};
`;

export const PaymentAmount = styled.span`
  ${TYPOGRAPHY.MT_4}
  color: ${({ theme }) => theme.mode.undefined_palette[400]};
`;

export const InstallmentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
`;

export const InstallmentLabel = styled.label`
  ${TYPOGRAPHY.BD_2}
  color: ${({ theme }) => theme.mode.grey[700]};
`;

export const DropdownStyle = (theme: Theme) => css`
  width: 100%;
  margin-bottom: 40px;

  & > button {
    width: 100%;
    background-color: ${theme.mode.grey[100]};
    color: ${theme.mode.grey[600]};
    ${TYPOGRAPHY.ST_4}
  }

  & > ul {
    width: 100%;
    left: 0 !important;
    right: auto !important;
    z-index: ${zIndex.popover};
    background-color: ${theme.mode.grey[100]} !important;
    border: 1px solid ${theme.mode.grey[300]} !important;
    border-radius: 12px;
    padding: 10px 12px;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04);
  }

  & > ul > li {
    ${TYPOGRAPHY.ST_4}
    color: ${theme.mode.grey[600]};
    border-bottom: 1px solid ${theme.mode.grey[300]};
    font-weight: ${typography.fontWeight.medium};

    &:last-child {
      border-bottom: none;
    }
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
