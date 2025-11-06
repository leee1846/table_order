import { css, Theme } from '@emotion/react';

export const globalStyles = (theme: Theme) => css`
  @font-face {
    font-family: 'Pretendard';
    src: url('./fonts/Pretendard-Regular.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
  }
  @font-face {
    font-family: 'Pretendard';
    src: url('./fonts/Pretendard-Medium.woff2') format('woff2');
    font-weight: 500;
    font-style: normal;
  }
  @font-face {
    font-family: 'Pretendard';
    src: url('./fonts/Pretendard-Bold.woff2') format('woff2');
    font-weight: 700;
    font-style: normal;
  }

  body {
    font-family:
      'Pretendard',
      -apple-system,
      BlinkMacSystemFont,
      system-ui,
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      sans-serif;
    font-size: ${theme.typography.fontSize.sm};
    font-weight: ${theme.typography.fontWeight.regular};
    line-height: ${theme.typography.lineHeight.sm};
    color: ${theme.colors.text.primary};
    background-color: ${theme.colors.background.default};
  }

  code,
  pre {
    font-family: ${theme.typography.fontFamily.mono};
  }

  strong {
    font-weight: ${theme.typography.fontWeight.bold};
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.grey[100]};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.grey[400]};
    border-radius: ${theme.borderRadius.md};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.grey[500]};
  }
`;
