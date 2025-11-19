import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';
import {
  BaseDialogContainer,
  BaseCloseButton,
  BaseHeader,
} from '../../shared/dialogStyles';

const { zIndex, colors, spacing } = theme;

export const DetailOrderDialog = styled(BaseDialogContainer)`
  width: ${spacing.dialogWidth.medium};
  z-index: ${zIndex.modal + 1};
`;

export const Header = styled(BaseHeader)`
  justify-content: center;
`;

export const CloseButtonWrapper = BaseCloseButton;

export const Title = styled.h3`
  ${TYPOGRAPHY.MT_1}
  color: ${colors.grey[800]};
  margin-top: 20px;
  border: 1px solid red;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

export const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 24px;
  background-color: ${colors.grey[100]};
  border-radius: 12px;
  margin-bottom: 16px;
`;

export const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  text-align: center;

  div:nth-of-type(1) {
    div {
      text-align: left;
    }
  }

  div:nth-of-type(3) {
    div {
      text-align: right;
    }
  }
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  div:nth-of-type(1) {
    color: ${colors.grey[500]};
    ${TYPOGRAPHY.CT_1}
  }
  div:nth-of-type(2) {
    color: ${colors.grey[800]};
    ${TYPOGRAPHY.MT_6}
  }
`;

export const InfoLabel = styled.div`
  ${TYPOGRAPHY.ST_4}
  color: ${colors.grey[600]};
`;

export const InfoValue = styled.div`
  ${TYPOGRAPHY.MT_7}
  color: ${colors.grey[800]};
`;

export const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid ${colors.grey[200]};
  overflow: auto;
  height: 37vh;
  border-bottom: 1px solid ${colors.grey[200]};
`;

export const MenuItem = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  align-items: center;
  padding: 8px;
  ${TYPOGRAPHY.ST_2}
`;

export const MenuName = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const MenuQty = styled.div`
  text-align: right;
`;

export const MenuPrice = styled.div<{ isOption?: boolean }>`
  text-align: right;
`;

export const OptionItem = styled.div<{ isOption?: boolean }>`
  display: grid;
  grid-template-columns: 7fr 1fr 1fr;
  align-items: center;
  ${TYPOGRAPHY.ST_4}
  color: ${colors.grey[500]};
  padding: 8px 8px 8px 16px;
`;

export const OptionName = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const OptionQty = styled.div`
  text-align: right;
`;

export const OptionPrice = styled.div`
  text-align: right;
`;

export const Footer = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  margin-top: 16px;
  padding: 4px 8px;
  ${TYPOGRAPHY.MT_2}
`;

export const TotalLabel = styled.div`
  color: ${colors.grey[800]};
  flex: 1;
`;

export const TotalQty = styled.div`
  color: ${colors.primary[500]};
  text-align: right;
`;

export const TotalPrice = styled.div`
  color: ${colors.primary[500]};
  text-align: right;
`;
