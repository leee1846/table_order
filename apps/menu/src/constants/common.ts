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
    label: '영어',
    flag: usFlagIcon,
  },
  ch: {
    label: '중국어',
    flag: chFlagIcon,
  },
  jp: {
    label: '일본어',
    flag: jpFlagIcon,
  },
} as const;
