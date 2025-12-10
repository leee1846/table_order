import { ROUTES } from '@/constants/routes';
import { type TMenu } from '@repo/feature/components';
import type { TFunction } from 'i18next';

export const getSidebarMenus = (t: TFunction): TMenu[] => [
  {
    id: 'misc',
    label: t('설정'),
    path: ROUTES.SETTINGS.MISCELLANEOUS.generate(),
  },
];
