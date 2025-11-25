import styled from '@emotion/styled';
import { TYPOGRAPHY, type Theme } from '@repo/ui';

export const Container = styled.div`
  width: 58.75rem;
  max-width: calc(100vw - 2rem);
  padding: 24px;
  background-color: ${({ theme }) =>
    theme.themeMode === 'dark'
      ? theme.darkModeColors.grey[50]
      : theme.colors.white};
  border-radius: 1.25rem;
`;

export const Title = styled.p`
  ${TYPOGRAPHY.MT_1}
  color: ${({ theme }) => theme.mode.grey[900]};
  margin: 20px 0 40px;
  text-align: center;
`;

export const PaymentMethodList = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 40px;
`;

const getBackgroundColor = (theme: Theme, isSelected: boolean) => {
  if (isSelected) {
    if (theme.themeMode === 'dark') {
      return theme.darkModeColors.grey[200];
    }
    return theme.colors.primary[200];
  }

  if (theme.themeMode === 'dark') {
    return theme.darkModeColors.grey[100];
  }
  return theme.colors.grey[100];
};

export const getColor = (theme: Theme, isSelected: boolean) => {
  if (isSelected) {
    if (theme.themeMode === 'dark') {
      return theme.darkModeColors.white;
    }
    return theme.colors.black;
  }

  return theme.mode.grey[700];
};

export const PaymentMethodItem = styled.button<{ isSelected: boolean }>`
  width: 100%;
  height: 11.8125rem;
  padding: 24px;
  background-color: ${({ theme, isSelected }) =>
    getBackgroundColor(theme, isSelected)};
  border: ${({ theme, isSelected }) =>
    isSelected ? `1px solid ${theme.mode.primary[500]}` : 'none'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-radius: 1rem;
  ${TYPOGRAPHY.MT_5}
  color: ${({ theme, isSelected }) => getColor(theme, isSelected)};
`;
