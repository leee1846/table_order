import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';
import {
  BaseDialogContainer,
  BaseCloseButton,
  BaseHeader,
  BaseTitle,
} from '../../../../shared/dialogStyles';

const { colors } = theme;

export const DialogContainer = styled(BaseDialogContainer)`
  width: ${theme.spacing.dialogWidth.small};
`;

export const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 40px;
`;

export const CloseButton = BaseCloseButton;

export const Header = BaseHeader;

export const Title = BaseTitle;

export const AmountDisplay = styled.div<{ $isPlaceholder: boolean }>`
  ${TYPOGRAPHY.MT_1}
  color: ${({ $isPlaceholder }) =>
    $isPlaceholder ? colors.primary[100] : colors.grey[900]};
  text-align: center;
  transition: color 0.2s ease;
`;

export const KeypadWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Footer = styled.div`
  padding-top: 16px;
`;
