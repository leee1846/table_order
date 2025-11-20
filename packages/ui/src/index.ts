import { colors } from './theme/colors';
import { typography, TYPOGRAPHY } from './theme/typography';
import { zIndex } from './theme/zIndex';
import { spacing } from './theme/spacing';
import { getModeColors } from './theme/modeColors';

const baseTheme = {
  colors,
  typography,
  zIndex,
  spacing,
};

export const createTheme = (mode: 'light' | 'dark') => ({
  ...baseTheme,
  mode: getModeColors(mode),
});

export const theme = createTheme('light');
export { ThemeProvider, DynamicThemeProvider } from './provider';
export { ThemeModeProvider } from './contexts/ThemeModeContext';
export { useThemeMode } from './hooks/useThemeMode';
export { TYPOGRAPHY };

export type Theme = ReturnType<typeof createTheme>;
export type { ThemeMode } from './theme/modeColors';
export type { ThemeModeContextValue } from './contexts/ThemeModeContext';
