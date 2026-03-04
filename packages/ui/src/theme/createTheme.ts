import { colors } from './colors';
import { typography } from './typography';
import { zIndex } from './zIndex';
import { spacing } from './spacing';
import { getModeColors, darkModeColors } from './modeColors';

export const baseTheme = {
  colors,
  darkModeColors,
  typography,
  zIndex,
  spacing,
};

export const createTheme = (mode: 'light' | 'dark') => ({
  ...baseTheme,
  themeMode: mode,
  mode: getModeColors(mode),
});

export type Theme = ReturnType<typeof createTheme>;
export const theme = createTheme('light');
