import {
  jpFlagIcon,
  koFlagIcon,
  chFlagIcon,
  usFlagIcon,
  ruFlagIcon,
} from '@repo/ui/icons';
import type { TShopLanguage } from '@repo/api/types';

/** 매장에 노출되는 언어 버튼 정렬 순서 (API 목록 순서와 무관) */
export const SHOP_LANGUAGE_DISPLAY_ORDER: readonly TShopLanguage[] = [
  'KO',
  'EN',
  'CH',
  'JP',
  'RU',
];

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

export const URLS = {
  MENU_APP_DOWNLOAD:
    'https://nexa-test.handorder.co.kr/apk/MENU/nexa-menu-debug.apk',
  ADMIN_APP_DOWNLOAD:
    'https://nexa-test.handorder.co.kr/apk/POS_APP/nexa-admin-debug.apk',
};
