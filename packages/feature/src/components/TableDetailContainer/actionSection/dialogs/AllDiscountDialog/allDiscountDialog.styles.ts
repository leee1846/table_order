import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';
import {
  BaseDialogContainer,
  BaseHeader,
  BaseTitle,
} from '../../../../shared/dialogStyles';

const { colors } = theme;

export const DialogContainer = styled(BaseDialogContainer)`
  width: ${theme.spacing.dialogWidth.small};
  height: 80vh;
`;

export const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const CloseButton = styled.button`
  cursor: pointer;
  text-align: right;
  transform: translate(-6px, 6px);
`;

export const Header = BaseHeader;

export const Title = BaseTitle;

export const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const OptionLabel = styled.span`
  ${TYPOGRAPHY.MT_5}
  color: ${colors.grey[900]};
`;

export const InputWrapper = styled.div`
  margin-top: 8px;
`;

export const PercentSymbol = styled.span`
  ${TYPOGRAPHY.MT_5}
  color: ${colors.grey[600]};
  padding-right: 12px;
`;

export const Footer = styled.div``;
