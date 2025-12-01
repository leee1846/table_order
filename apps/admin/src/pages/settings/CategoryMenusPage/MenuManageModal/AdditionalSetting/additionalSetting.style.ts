import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

export const SetionContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;

  & > p {
    ${TYPOGRAPHY.BD_2}
    color: ${theme.colors.grey[800]};
  }
`;

export const ColorChips = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 3.25rem;
  mix-blend-mode: luminosity;
`;

export const ColorChip = styled.button<{ color: string; selected: boolean }>`
  width: 2.70833rem;
  height: 2.70833rem;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  aspect-ratio: 43.33/43.33;
  border: ${({ selected }) =>
    selected ? `2px solid ${theme.colors.grey[900]}` : '2px solid transparent'};
  cursor: pointer;
`;
