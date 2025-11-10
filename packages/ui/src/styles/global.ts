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
  }

  code,
  pre {
    font-family: ${theme.typography.fontFamily.mono};
  }

  strong {
    font-weight: ${theme.typography.fontWeight.bold};
  }
`;
