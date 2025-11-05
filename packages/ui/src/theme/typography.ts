export const typography = {
  fontFamily: {
    sans: 'Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"Fira Code", "Courier New", monospace',
  },
  fontSize: {
    xxs: '0.625rem', // 10px
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    md: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    xxl: '1.5rem', // 24px
    xxxl: '1.625rem', // 26px
    xxxxl: '1.75rem', // 28px
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    bold: 700,
  },
  lineHeight: {
    xxs: '0.875rem', // 14px
    xs: '1rem', // 16px
    sm: '1.25rem', // 20px
    md: '1.5rem', // 24px
    lg: '1.625rem', // 26px
    xl: '1.875rem', // 30px
    xxl: '2rem', // 32px
    xxxl: '2.25rem', // 36px
    xxxxl: '2.375rem', // 38px
  },
  letterSpacing: {
    tight: '-0.025rem',
  },
} as const;

export const TYPOGRAPHY = {
  MT_1: {
    fontSize: typography.fontSize.xxxxl,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: typography.lineHeight.xxxxl,
  },
  MT_2: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: typography.lineHeight.xxxl,
  },
  MT_3: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: typography.lineHeight.xxxl,
  },
  MT_4: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: typography.lineHeight.xxl,
  },
  MT_5: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: typography.lineHeight.xxl,
  },
  MT_6: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: typography.lineHeight.xl,
  },
  MT_7: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: typography.lineHeight.xl,
  },
  ST_1: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: typography.lineHeight.lg,
  },
  ST_2: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: typography.lineHeight.lg,
  },
  ST_3: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: typography.lineHeight.md,
  },
  ST_4: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: typography.lineHeight.md,
  },
  ST_5: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.regular,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: typography.lineHeight.md,
  },
  BD_1: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: typography.lineHeight.sm,
  },
  BD_2: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: typography.lineHeight.sm,
  },
  BD_3: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: typography.lineHeight.sm,
  },
  CT_1: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: typography.lineHeight.xs,
  },
  CT_2: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: typography.lineHeight.xs,
  },
  CT_3: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.regular,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: typography.lineHeight.xs,
  },
  CT_4: {
    fontSize: typography.fontSize.xxs,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: typography.lineHeight.xxs,
  },
  CT_5: {
    fontSize: typography.fontSize.xxs,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: typography.lineHeight.xxs,
  },
  CT_6: {
    fontSize: typography.fontSize.xxs,
    fontWeight: typography.fontWeight.regular,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: typography.lineHeight.xxs,
  },
};
