'use client';

import { ThemeProvider as EmotionThemeProvider, Global } from '@emotion/react';
import type { ReactNode } from 'react';
import { createTheme } from './theme/createTheme';
import { resetStyles } from './styles/reset';
import { globalStyles } from './styles/global';
import { useThemeMode } from './hooks/useThemeMode';

interface Props {
  children: ReactNode;
}

/**
 * 다크모드를 지원하는 동적 ThemeProvider
 * ThemeModeProvider 내부에서 사용해야 함
 */
const DynamicThemeProvider = ({ children }: Props) => {
  const { mode } = useThemeMode();
  const theme = createTheme(mode);

  return (
    <EmotionThemeProvider theme={theme}>
      <Global styles={resetStyles} />
      <Global styles={globalStyles(theme)} />
      {children}
    </EmotionThemeProvider>
  );
};

/**
 * 다크모드를 사용하지 않는 정적 ThemeProvider
 * 기본적으로 라이트 모드 사용
 *
 * @example
 * ```tsx
 * import { ThemeProvider } from '@repo/ui';
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
  const theme = createTheme('light');

  return (
    <EmotionThemeProvider theme={theme}>
      <Global styles={resetStyles} />
      <Global styles={globalStyles(theme)} />
      {children}
    </EmotionThemeProvider>
  );
};

// 다크모드용 동적 Provider export
export { DynamicThemeProvider };
