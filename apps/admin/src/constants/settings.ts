import { ROUTES } from '@/constants/routes';
import { type TMenu, type TSubMenu } from '@repo/feature/components';
import type { TFunction } from 'i18next';
import { CapacitorApp } from '@repo/util/app';
import { isShopRole } from '@/utils/common';

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
    ...(!isShopRole()
      ? [
          {
            id: 'categories',
            label: translate('카테고리 설정'),
            path: ROUTES.SETTINGS.CATEGORIES.generate(),
          },
        ]
      : []),
    {
      id: 'menus',
      label: translate('메뉴 설정'),
      matchPattern: `${ROUTES.SETTINGS.path}/${ROUTES.SETTINGS.CATEGORY_MENUS.path}`,
      subMenus: menuSubMenus,
    },
    ...(!isShopRole()
      ? [
          {
            id: 'sales',
            label: translate('매출 현황'),
            matchPattern: `${ROUTES.SETTINGS.path}/${ROUTES.SETTINGS.SALES.path}`,
            subMenus: CapacitorApp.isNative()
              ? [
                  // 앱 전용 메뉴
                  {
                    id: 'summary',
                    label: translate('매출개요'),
                    path: ROUTES.SETTINGS.SALES.SUMMARY.generate(),
                  },
                  {
                    id: 'order',
                    label: translate('주문내역'),
                    path: ROUTES.SETTINGS.SALES.ORDER.generate(),
                  },
                  {
                    id: 'card',
                    label: translate('카드승인현황'),
                    path: ROUTES.SETTINGS.SALES.CARD.generate(),
                  },
                  {
                    id: 'menu',
                    label: translate('메뉴별현황'),
                    path: ROUTES.SETTINGS.SALES.MENU.generate(),
                  },
                ]
              : [
                  // 웹 전용 메뉴
                  {
                    id: 'daily',
                    label: translate('당일 매출내역'),
                    path: ROUTES.SETTINGS.SALES.SALES_DAILY.generate(),
                  },
                  {
                    id: 'daily-history',
                    label: translate('일별 매출내역'),
                    path: ROUTES.SETTINGS.SALES.SALES_DAILY_HISTORY.generate(),
                  },
                  {
                    id: 'hourly',
                    label: translate('시간별 매출내역'),
                    path: ROUTES.SETTINGS.SALES.SALES_HOURLY.generate(),
                  },
                  {
                    id: 'menu-history',
                    label: translate('메뉴별 매출내역'),
                    path: ROUTES.SETTINGS.SALES.MENU_HISTORY.generate(),
                  },
                  {
                    id: 'calendar',
                    label: translate('달력 매출내역'),
                    path: ROUTES.SETTINGS.SALES.SALES_CALENDAR.generate(),
                  },
                  {
                    id: 'report',
                    label: translate('매출 리포트'),
                    path: ROUTES.SETTINGS.SALES.SALES_REPORT.generate(),
                  },
                ],
          },
          {
            id: 'menu-screen',
            label: translate('메뉴 화면'),
            path: ROUTES.SETTINGS.MENU_SCREEN.generate(),
          },
          {
            id: 'start-screen',
            label: translate('시작 화면'),
            matchPattern: `${ROUTES.SETTINGS.path}/${ROUTES.SETTINGS.START_SCREEN.path}`,
            subMenus: [
              {
                id: 'theme',
                label: translate('테마 설정'),
                path: ROUTES.SETTINGS.START_SCREEN.THEME.generate(),
              },
              {
                id: 'logo',
                label: translate('로고 등록'),
                path: ROUTES.SETTINGS.START_SCREEN.LOGO.generate(),
              },
              {
                id: 'image-registration',
                label: translate('이미지 등록'),
                path: ROUTES.SETTINGS.START_SCREEN.IMAGE_REGISTRATION.generate(),
              },
            ],
          },
          ...(CapacitorApp.isNative()
            ? []
            : [
                {
                  id: 'device-management',
                  label: translate('기기관리'),
                  path: ROUTES.SETTINGS.DEVICE_MANAGEMENT.generate(),
                },
              ]),
        ]
      : []),
    {
      id: 'miscellaneous',
      label: translate('환경 설정'),
      path: ROUTES.SETTINGS.MISCELLANEOUS.generate(),
    },
  ];

  if (!isShopRole()) {
    const tablesMenuIndex = menus.findIndex((menu) => menu.id === 'sales');
    menus.splice(tablesMenuIndex + 1, 0, {
      id: 'tables',
      label: translate('테이블 구성'),
      path: ROUTES.SETTINGS.TABLES.generate(),
    });
  }

  return menus;
};
