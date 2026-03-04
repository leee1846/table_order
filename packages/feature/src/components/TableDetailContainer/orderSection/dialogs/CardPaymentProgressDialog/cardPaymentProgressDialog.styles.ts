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
  margin-bottom: 40px;
`;

export const Title = styled(BaseTitle)`
  text-align: center;
`;

export const InstructionText = styled.p`
  ${TYPOGRAPHY.ST_2}
  color: ${colors.grey[600]};
  text-align: center;
  margin-bottom: 12px;
`;

export const CardImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;

  img {
    width: 100%;
    height: auto;
  }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: auto;
`;

export const CancelButtonStyle = css``;
