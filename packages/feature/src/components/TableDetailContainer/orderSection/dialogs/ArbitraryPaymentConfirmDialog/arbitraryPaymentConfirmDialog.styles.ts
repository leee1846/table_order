import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { theme, TYPOGRAPHY } from '@repo/ui';
import {
  BaseDialogContainer,
  BaseCloseButton,
  BaseTitle,
  BaseHeader,
} from '../../../../shared/dialogStyles';

const { colors, spacing } = theme;

export const DialogContainer = styled(BaseDialogContainer)`
  width: ${spacing.dialogWidth.xsmall};
`;

export const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const CloseButton = BaseCloseButton;

export const Header = styled(BaseHeader)`
  margin-bottom: 12px !important;
`;

export const Title = styled(BaseTitle)`
  text-align: center;
  margin-bottom: 12px;
`;

export const WarningText = styled.p`
  ${TYPOGRAPHY.ST_2}
  color: ${colors.grey[600]};
  text-align: center;
  margin-bottom: 130px;
`;

export const CheckboxWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 24px 0;
  color: ${colors.grey[600]};
  ${TYPOGRAPHY.ST_4}
`;

export const Footer = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  margin-top: 8px;
`;

export const BackButtonStyle = css`
  flex: 1;
`;
