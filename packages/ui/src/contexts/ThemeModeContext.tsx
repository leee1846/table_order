import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { ThemeMode } from '../theme/modeColors';
import { createTheme, type Theme } from '../index';

export interface ThemeModeContextValue {
  mode: ThemeMode;
  theme: Theme;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
  appType?: 'admin' | 'menu';
}

export const ThemeModeContext = createContext<
  ThemeModeContextValue | undefined
>(undefined);

const THEME_MODE_STORAGE_KEY = 'theme-mode';

const getInitialMode = (): ThemeMode => {
  const stored = localStorage.getItem(THEME_MODE_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  // 시스템 설정 확인
  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }

  return 'light';
};

interface ThemeModeProviderProps {
  children: ReactNode;
  initialMode?: ThemeMode;
  appType?: 'admin' | 'menu';
}

/**
 * 테마 모드 Provider 컴포넌트
 * 테마 모드 상태를 관리하고 localStorage에 저장
 * theme 객체를 제공하여 컴포넌트에서 theme.mode.grey[200] 같은 방식으로 사용 가능
 *
 * @example
 * ```tsx
 * import { ThemeModeProvider, useThemeMode } from '@repo/ui';
 *
 * function App() {
 *   return (
 *     <ThemeModeProvider>
 *       <YourApp />
 *     </ThemeModeProvider>
 *   );
 * }
 *
 * function Component() {
 *   const { theme } = useThemeMode();
 *   const color = theme.mode.grey[200]; // 다크모드/라이트모드에 따라 자동 변경
 * }
 * ```
 */
export const ThemeModeProvider = ({
  children,
  initialMode,
  appType,
}: ThemeModeProviderProps) => {
  const [mode, setModeState] = useState<ThemeMode>(
    initialMode ?? getInitialMode
  );

  // localStorage에 모드 저장
  useEffect(() => {
    localStorage.setItem(THEME_MODE_STORAGE_KEY, mode);
  }, [mode]);

  // 라이트/다크 모드 토글
  const toggleMode = () => {
    setModeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // 특정 모드 설정
  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
  };

  // mode에 따라 theme 생성
  const theme = createTheme(mode);

  const value = {
    mode,
    theme,
    toggleMode,
    setMode,
    appType,
  };

  return (
    <ThemeModeContext.Provider value={value}>
      {children}
    </ThemeModeContext.Provider>
  );
};
