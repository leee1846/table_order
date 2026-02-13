import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';
import {
  BaseDialogContainer,
  BaseCloseButton,
  BaseHeader,
  BaseTitle,
} from '../../../../shared/dialogStyles';

const { colors } = theme;

export const CloseButton = BaseCloseButton;

export const DialogContainer = styled(BaseDialogContainer)`
  width: ${theme.spacing.dialogWidth.large};
  max-height: 80vh;
  min-height: 70vh;
`;

export const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  min-height: 0;
`;

export const Header = styled(BaseHeader)`
  margin-bottom: 40px;
`;

export const Title = BaseTitle;

export const ItemsList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 15px;
`;

export const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ItemName = styled.span`
  ${TYPOGRAPHY.MT_5}
  color: ${colors.grey[900]};
`;

export const ItemOptions = styled.div`
  ${TYPOGRAPHY.ST_5}
  color: ${colors.grey[600]};
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-left: 35px;
`;

export const QuantityWrapper = styled.div`
  flex-shrink: 0;
`;

export const Footer = styled.div``;
