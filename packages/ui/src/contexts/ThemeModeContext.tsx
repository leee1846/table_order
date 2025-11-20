import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { ThemeMode } from '../theme/modeColors';

export interface ThemeModeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
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
}

/**
 * 테마 모드 Provider 컴포넌트
 * 테마 모드 상태를 관리하고 localStorage에 저장
 *
 * @example
 * ```tsx
 * import { ThemeModeProvider } from '@repo/ui';
 *
 * function App() {
 *   return (
 *     <ThemeModeProvider>
 *       <YourApp />
 *     </ThemeModeProvider>
 *   );
 * }
 * ```
 */
export const ThemeModeProvider = ({
  children,
  initialMode,
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

  const value = {
    mode,
    toggleMode,
    setMode,
  };

  return (
    <ThemeModeContext.Provider value={value}>
      {children}
    </ThemeModeContext.Provider>
  );
};
