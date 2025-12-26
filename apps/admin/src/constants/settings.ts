import { ROUTES } from '@/constants/routes';
import { type TMenu, type TSubMenu } from '@repo/feature/components';

export const createSidebarMenus = (menuSubMenus?: TSubMenu[]): TMenu[] => [
  {
    id: 'notices',
    label: '공지사항',
    path: ROUTES.SETTINGS.NOTICES.generate(),
  },
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
    matchPattern: `${ROUTES.SETTINGS.path}/${ROUTES.SETTINGS.SALES.path}`,
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
      // {
      //   id: 'cash',
      //   label: '단순현금결제내역',
      //   path: ROUTES.SETTINGS.SALES.CASH.generate(),
      // },
      {
        id: 'menu',
        label: '메뉴판매집계',
        path: ROUTES.SETTINGS.SALES.MENU.generate(),
      },
    ],
  },
  {
    id: 'tables',
    label: '테이블 설정',
    path: ROUTES.SETTINGS.TABLES.generate(),
  },
  {
    id: 'theme',
    label: '테마 설정',
    matchPattern: `${ROUTES.SETTINGS.path}/${ROUTES.SETTINGS.THEME.path}`,
    subMenus: [
      {
        id: 'start-screen',
        label: '시작 화면',
        path: ROUTES.SETTINGS.THEME.START_SCREEN.generate(),
      },
      {
        id: 'menu-screen',
        label: '메뉴 화면',
        path: ROUTES.SETTINGS.THEME.MENU_SCREEN.generate(),
      },
    ],
  },
  {
    id: 'miscellaneous',
    label: '설정',
    path: ROUTES.SETTINGS.MISCELLANEOUS.generate(),
  },
];
