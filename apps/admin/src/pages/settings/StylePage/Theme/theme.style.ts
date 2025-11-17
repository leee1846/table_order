import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;

  & > p {
    color: ${({ theme }) => theme.colors.grey[800]};
    ${TYPOGRAPHY.MT_6}
  }
`;

export const Themes = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  & > button {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    cursor: pointer;
  }
`;

export const ThemeColor = styled.div<{ backgroundColors: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 12.70833rem;
  border-radius: 0.75rem;
  background-color: ${({ backgroundColors }) => backgroundColors};
  ${TYPOGRAPHY.MT_6}
  color: ${({ theme }) => theme.colors.primary[400]};
`;
