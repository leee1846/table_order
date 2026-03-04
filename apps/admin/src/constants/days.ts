import type { TFunction } from 'i18next';

export const getDays = (translate: TFunction) => [
  { value: 0, label: translate('일') },
  { value: 1, label: translate('월') },
  { value: 2, label: translate('화') },
  { value: 3, label: translate('수') },
  { value: 4, label: translate('목') },
  { value: 5, label: translate('금') },
  { value: 6, label: translate('토') },
];
