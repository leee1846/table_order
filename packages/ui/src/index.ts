import { colors } from './theme/colors';
import { typography, TYPOGRAPHY } from './theme/typography';
import { zIndex } from './theme/zIndex';
import { spacing } from './theme/spacing';

export const theme = {
  colors,
  typography,
  zIndex,
  spacing,
} as const;

export type Theme = typeof theme;

// Provider exports
export { ThemeProvider } from './provider';

export { TYPOGRAPHY };
