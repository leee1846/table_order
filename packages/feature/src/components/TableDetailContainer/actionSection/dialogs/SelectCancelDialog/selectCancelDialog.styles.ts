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

export const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  margin-bottom: 40px;
`;

export const Title = styled.h3`
  ${TYPOGRAPHY.MT_1}
  color: ${colors.grey[800]};
`;

export const ItemsList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const ItemName = styled.span`
  ${TYPOGRAPHY.MT_5}
  color: ${colors.grey[900]};
  flex: 1;
`;

export const QuantityWrapper = styled.div`
  flex-shrink: 0;
`;

export const Footer = styled.div``;
