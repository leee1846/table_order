export { ButtonExample } from './ButtonExample';

import { colors } from './theme/colors';
import { typography } from './theme/typography';
import { spacing, borderRadius, shadows } from './theme/spacing';

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} as const;

export type Theme = typeof theme;

// Style exports
export { resetStyles } from './styles/reset';
export { globalStyles } from './styles/global';

// Provider exports
export { ThemeProvider } from './provider';
