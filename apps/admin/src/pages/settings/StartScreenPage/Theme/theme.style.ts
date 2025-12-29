import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;

  & > p {
    color: ${theme.colors.grey[800]};
    ${TYPOGRAPHY.MT_6}
  }
`;

export const Themes = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  border-radius: 0.75rem;
  background-color: ${theme.colors.grey[100]};

  & > button {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
  }
`;

export const ThemeColor = styled.div<{ backgroundColors: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 100%;
  height: 12.70833rem;
  border-radius: 0.75rem;

  ${TYPOGRAPHY.MT_6}
  color: ${theme.colors.grey[500]};
  overflow: hidden;
  border: 1px solid ${theme.colors.grey[300]};

  > div:first-of-type {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;

    background-color: ${({ backgroundColors }) => backgroundColors};
  }

  > div:last-of-type {
    flex: 1.5;
    background-color: ${theme.colors.grey[200]};
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const RadioButtonStyle = css`
  ${TYPOGRAPHY.MT_7}
`;
