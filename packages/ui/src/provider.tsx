'use client';

import { ThemeProvider as EmotionThemeProvider, Global } from '@emotion/react';
import type { ReactNode } from 'react';
import { theme } from '@/theme';
import { resetStyles } from '@/styles/reset';
import { globalStyles } from '@/styles/global';

interface Props {
  children: ReactNode;
}

/**
 * @example
 * ```tsx
 * import { ThemeProvider } from '@repo/ui/provider';
 *
 * function App() {
 *   return (
 *     <ThemeProvider>
 *       <YourApp />
 *     </ThemeProvider>
 *   );
 * }
 * ```
 */
export const ThemeProvider = ({ children }: Props) => {
  return (
    <EmotionThemeProvider theme={theme}>
      <Global styles={resetStyles} />
      <Global styles={globalStyles(theme)} />
      {children}
    </EmotionThemeProvider>
  );
};
