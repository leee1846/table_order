import {
  jpFlagIcon,
  koFlagIcon,
  chFlagIcon,
  usFlagIcon,
  ruFlagIcon,
} from '@repo/ui/icons';

export const CURRENCY_SYMBOL: Record<'KRW' | 'USD', string> = {
  KRW: '₩',
  USD: '$',
};

export const LANGUAGE_CONFIG = {
  KO: {
    label: '한국어',
    flag: koFlagIcon,
  },
  EN: {
    label: 'English',
    flag: usFlagIcon,
  },
  CH: {
    label: '中文',
    flag: chFlagIcon,
  },
  JP: {
    label: '日本語',
    flag: jpFlagIcon,
  },
  RU: {
    label: 'Русский',
    flag: ruFlagIcon,
  },
} as const;

export const MENU_MAX_QUANTITY = 999;
