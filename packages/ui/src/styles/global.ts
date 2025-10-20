import { css } from '@emotion/react';
import type { Theme } from '@/theme';

export const globalStyles = (theme: Theme) => css`
  body {
    font-family: ${theme.typography.fontFamily.sans};
    font-size: ${theme.typography.fontSize.base};
    font-weight: ${theme.typography.fontWeight.normal};
    line-height: ${theme.typography.lineHeight.normal};
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
    border-radius: ${theme.borderRadius.base};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.grey[500]};
  }
`;
