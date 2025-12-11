import { jpFlagIcon, koFlagIcon, chFlagIcon, usFlagIcon } from '@repo/ui/icons';

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
    // TODO: 러시아 플래그 아이콘 추가 예정
    flag: jpFlagIcon,
  },
} as const;
