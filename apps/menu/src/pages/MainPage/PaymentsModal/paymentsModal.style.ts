import styled from '@emotion/styled';
import { TYPOGRAPHY, type Theme } from '@repo/ui';

export const Container = styled.div`
  width: 58.75rem;
  max-width: calc(100vw - 2rem);
  padding: 24px;
  background-color: ${({ theme }) => theme.mode.undefined_palette[200]};
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

export const PaymentMethodItem = styled.button<{ isSelected: boolean }>`
  width: 100%;
  height: 11.8125rem;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-radius: 1rem;
  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.mode.undefined_palette[500] : theme.mode.grey[100]};
  border: ${({ theme, isSelected }) =>
    isSelected ? `1px solid ${theme.mode.primary[500]}` : 'none'};
  color: ${({ theme, isSelected }) =>
    isSelected ? theme.mode.undefined_palette[400] : theme.mode.grey[700]};
  ${TYPOGRAPHY.MT_5}
`;
