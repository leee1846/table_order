import { ROUTES } from '@/constants/routes';

export type TSubMenu = {
  id: string | number;
  label: string;
  path: string;
};

export type TMenu = {
  id: string;
  label: string;
  path?: string;
  subMenus?: TSubMenu[];
  matchPattern?: string; // 하위 경로 매칭용
};

export const createSidebarMenus = (menuSubMenus?: TSubMenu[]): TMenu[] => [
  {
    id: 'categories',
    label: '카테고리 관리',
    path: ROUTES.SETTINGS.CATEGORIES.generate(),
  },
  {
    id: 'menus',
    label: '메뉴 관리',
    matchPattern: `${ROUTES.SETTINGS.path}/${ROUTES.SETTINGS.CATEGORY_MENUS.path}`,
    subMenus: menuSubMenus,
  },
  {
    id: 'sales',
    label: '매출 관리',
    matchPattern: `${ROUTES.SETTINGS.path}/${ROUTES.SETTINGS.SALES.SUMMARY.path}`,
    subMenus: [
      {
        id: 'summary',
        label: '매출요약',
        path: ROUTES.SETTINGS.SALES.SUMMARY.generate(),
      },
      {
        id: 'order',
        label: '주문내역',
        path: ROUTES.SETTINGS.SALES.ORDER.generate(),
      },
      {
        id: 'card',
        label: '카드승인내역',
        path: ROUTES.SETTINGS.SALES.CARD.generate(),
      },
      {
        id: 'cash',
        label: '단순현금결제내역',
        path: ROUTES.SETTINGS.SALES.CASH.generate(),
      },
      {
        id: 'menu',
        label: '메뉴판매집계',
        path: ROUTES.SETTINGS.SALES.MENU.generate(),
      },
    ],
  },
];
