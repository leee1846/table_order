import { ROUTES } from '@/constants/routes';
import { type TMenu } from '@repo/feature/components';
import type { TFunction } from 'i18next';
import type { TDeviceType } from '@repo/api/types';

export const getSidebarMenus = (
  t: TFunction,
  deviceType?: TDeviceType
): TMenu[] => {
  const menus: TMenu[] = [
    {
      id: 'misc',
      label: t('설정'),
      path: ROUTES.SETTINGS.MISCELLANEOUS.generate(),
    },
  ];

  // ORDER_POS 타입일 때만 카드승인내역 메뉴 추가
  if (deviceType === 'ORDER_POS') {
    menus.push({
      id: 'payments-cards',
      label: t('카드승인내역'),
      path: ROUTES.SETTINGS.PAYMENTS_CARDS.generate(),
    });
  }

  return menus;
};
