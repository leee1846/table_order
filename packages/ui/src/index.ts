import { colors } from './theme/colors';
import { typography, TYPOGRAPHY } from './theme/typography';

export const theme = {
  colors,
  typography,
} as const;

export type Theme = typeof theme;

// Style exports
export { resetStyles } from './styles/reset';
export { globalStyles } from './styles/global';

// Provider exports
export { ThemeProvider } from './provider';

export { TYPOGRAPHY };
