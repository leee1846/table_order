import { ROUTES } from '@/constants/routes';
import { type TMenu, type TSubMenu } from '@repo/feature/components';
import type { TFunction } from 'i18next';
import { CapacitorApp } from '@repo/util/app';

export const createSidebarMenus = (
  translate: TFunction,
  menuSubMenus?: TSubMenu[]
): TMenu[] => {
  const menus: TMenu[] = [
    {
      id: 'notices',
      label: translate('공지사항'),
      path: ROUTES.SETTINGS.NOTICES.generate(),
    },
    {
      id: 'categories',
      label: translate('카테고리 관리'),
      path: ROUTES.SETTINGS.CATEGORIES.generate(),
    },
    {
      id: 'menus',
      label: translate('메뉴 관리'),
      matchPattern: `${ROUTES.SETTINGS.path}/${ROUTES.SETTINGS.CATEGORY_MENUS.path}`,
      subMenus: menuSubMenus,
    },
    {
      id: 'sales',
      label: translate('매출 관리'),
      matchPattern: `${ROUTES.SETTINGS.path}/${ROUTES.SETTINGS.SALES.path}`,
      // 앱이면 매출요약, 웹이면 당일매출로 이동
      path: CapacitorApp.isNative()
        ? ROUTES.SETTINGS.SALES.SUMMARY.generate()
        : ROUTES.SETTINGS.SALES.SALES_DAILY.generate(),
      subMenus: CapacitorApp.isNative()
        ? [
            {
              id: 'summary',
              label: translate('매출요약'),
              path: ROUTES.SETTINGS.SALES.SUMMARY.generate(),
            },
            {
              id: 'order',
              label: translate('주문내역'),
              path: ROUTES.SETTINGS.SALES.ORDER.generate(),
            },
            {
              id: 'card',
              label: translate('카드승인내역'),
              path: ROUTES.SETTINGS.SALES.CARD.generate(),
            },
            // {
            //   id: 'cash',
            //   label: '단순현금결제내역',
            //   path: ROUTES.SETTINGS.SALES.CASH.generate(),
            // },
            {
              id: 'menu',
              label: translate('메뉴판매집계'),
              path: ROUTES.SETTINGS.SALES.MENU.generate(),
            },
          ]
        : [
            {
              id: 'daily',
              label: translate('당일 매출 내역'),
              path: ROUTES.SETTINGS.SALES.SALES_DAILY.generate(),
            },
          ],
    },
    {
      id: 'theme',
      label: translate('테마 설정'),
      matchPattern: `${ROUTES.SETTINGS.path}/${ROUTES.SETTINGS.THEME.path}`,
      subMenus: [
        {
          id: 'start-screen',
          label: translate('시작 화면'),
          path: ROUTES.SETTINGS.THEME.START_SCREEN.generate(),
        },
        {
          id: 'menu-screen',
          label: translate('메뉴 화면'),
          path: ROUTES.SETTINGS.THEME.MENU_SCREEN.generate(),
        },
      ],
    },
    {
      id: 'miscellaneous',
      label: translate('설정'),
      path: ROUTES.SETTINGS.MISCELLANEOUS.generate(),
    },
  ];

  // native일 때만 'tables' 메뉴 추가
  if (CapacitorApp.isNative()) {
    const tablesMenuIndex = menus.findIndex((menu) => menu.id === 'sales');
    menus.splice(tablesMenuIndex + 1, 0, {
      id: 'tables',
      label: translate('테이블 설정'),
      path: ROUTES.SETTINGS.TABLES.generate(),
    });
  }

  return menus;
};
