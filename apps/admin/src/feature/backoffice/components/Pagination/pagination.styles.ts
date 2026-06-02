import styled from '@emotion/styled';
import { theme } from '@repo/ui';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

export const Texts = styled.p`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.grey[600]};
  letter-spacing: -0.01em;
  line-height: 1.5;
`;

export const Buttons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Button = styled.button<{ padding?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  height: 32px;
  padding: ${({ padding }) => padding || '0 8px'};
  border-radius: 6px;
  border: 1px solid ${theme.colors.grey[300]};
  background-color: ${theme.colors.white};
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background-color: ${theme.colors.grey[50]};
    border-color: ${theme.colors.grey[400]};
  }

  &:active:not(:disabled) {
    background-color: ${theme.colors.grey[100]};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;
