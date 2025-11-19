import { ROUTES } from '@/constants/routes';
import { type TMenu } from '@repo/feature/components';

export const SIDEBAR_MENUS: TMenu[] = [
  {
    id: 'misc',
    label: '설정',
    path: ROUTES.SETTINGS.MISCELLANEOUS.generate(),
  },
];
