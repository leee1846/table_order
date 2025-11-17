import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';

const { colors } = theme;

export const DialogContainer = styled.div`
  background-color: ${colors.white};
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  width: ${theme.spacing.dialogWidth.small};
  padding: 24px;
  height: 80vh;
`;

export const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${theme.zIndex.modal};
`;

export const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-top: 20px;
  margin-bottom: 40px;
`;

export const Title = styled.h3`
  ${TYPOGRAPHY.MT_1}
  color: ${colors.grey[800]};
`;

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
