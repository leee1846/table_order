import { jpFlagIcon, koFlagIcon, chFlagIcon, usFlagIcon } from '@repo/ui/icons';

export const CURRENCY_SYMBOL: Record<'KRW' | 'USD', string> = {
  KRW: '₩',
  USD: '$',
};

export const LANGUAGE_CONFIG = {
  ko: {
    label: '한국어',
    flag: koFlagIcon,
  },
  en: {
    label: 'English',
    flag: usFlagIcon,
  },
  ch: {
    label: '中文',
    flag: chFlagIcon,
  },
  jp: {
    label: '日本語',
    flag: jpFlagIcon,
  },
} as const;
