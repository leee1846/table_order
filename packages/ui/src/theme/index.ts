import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, borderRadius, shadows } from '@/theme/spacing';

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} as const;

export type Theme = typeof theme;

// Export individual modules for tree-shaking
export { colors } from './colors';
export { typography } from './typography';
export { spacing, borderRadius, shadows } from './spacing';
