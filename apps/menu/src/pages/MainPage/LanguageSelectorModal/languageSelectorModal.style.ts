import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  width: 30rem;
  padding: 24px;
  background-color: ${({ theme }) => theme.mode.undefined_palette[200]};
  border-radius: 1.25rem;
  border: 1px solid ${({ theme }) => theme.mode.undefined_palette[1000]};
  display: flex;
  flex-direction: column;
  gap: 40px;
  align-items: center;

  & > p {
    ${TYPOGRAPHY.MT_1}
    color: ${({ theme }) => theme.mode.grey[900]};
  }
`;

export const Languages = styled.ul`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  & > li {
    width: 100%;
  }
`;

export const Language = styled.button<{ isSelected: boolean }>`
  width: 100%;
  padding: 16px;
  border-radius: 62.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  ${TYPOGRAPHY.MT_6}
  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.mode.undefined_palette[1200] : theme.mode.grey[50]};
  color: ${({ theme, isSelected }) =>
    isSelected ? theme.mode.undefined_palette[1300] : theme.mode.grey[700]};
  border: 1px solid
    ${({ theme, isSelected }) =>
      isSelected ? theme.mode.undefined_palette[1400] : theme.mode.grey[400]};
`;

export const CompleteButton = css`
  width: 100%;
`;
