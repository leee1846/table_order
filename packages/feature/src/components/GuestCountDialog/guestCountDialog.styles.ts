import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';

const { colors } = theme;

export const DialogContainer = styled.div`
  position: relative;
  background-color: ${colors.white};
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 640px;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  z-index: 1;

  &:hover {
    opacity: 0.7;
  }
`;

export const ContentWrapper = styled.div`
  padding: 48px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export const Title = styled.h3`
  ${TYPOGRAPHY.MT_1}
  color: ${colors.grey[800]};
`;

export const CounterSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const Label = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

export const LabelText = styled.span`
  ${TYPOGRAPHY.MT_1}
  color: ${colors.grey[800]};
`;

export const NumberInputWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1.5;
  width: 100%;

  > div {
    width: 100%;
    max-width: 100%;
  }
`;

export const Footer = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
`;
