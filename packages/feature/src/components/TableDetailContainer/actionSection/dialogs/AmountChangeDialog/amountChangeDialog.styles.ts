import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';

const { colors, zIndex } = theme;

export const DialogContainer = styled.div`
  background-color: ${colors.white};
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  width: ${theme.spacing.dialogWidth.small};
  padding: 24px;
`;

export const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 40px;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${zIndex.modal};
`;

export const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const Title = styled.h3`
  ${TYPOGRAPHY.MT_1}
  color: ${colors.grey[800]};
`;

export const AmountDisplay = styled.div<{ $isPlaceholder: boolean }>`
  ${TYPOGRAPHY.MT_1}
  color: ${({ $isPlaceholder }) =>
    $isPlaceholder ? colors.primary[100] : colors.primary[500]};
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
