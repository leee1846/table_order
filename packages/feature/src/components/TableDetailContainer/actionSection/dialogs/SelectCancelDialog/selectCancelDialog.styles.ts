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
  flex-direction: column;
  gap: 4px;
`;

export const ItemMainRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
`;

export const ItemCheckArea = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ItemName = styled.span`
  ${TYPOGRAPHY.MT_5}
  color: ${colors.grey[900]};
  flex: 1;
  min-width: 0;
  overflow-wrap: anywhere;
  word-break: break-word;
`;

export const ItemOptions = styled.div`
  ${TYPOGRAPHY.ST_5}
  color: ${colors.grey[600]};
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  /* CheckButton: 체크박스(1.5rem) + label gap(7px) — 메뉴명 시작선과 동일 */
  margin-left: calc(1.5rem + 7px);

  & > div {
    overflow-wrap: anywhere;
    word-break: break-word;
  }
`;

export const QuantityWrapper = styled.div`
  flex-shrink: 0;
`;

export const Footer = styled.div``;
