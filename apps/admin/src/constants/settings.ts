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

export const SIDEBAR_MENUS: TMenu[] = [
  {
    id: 'categories',
    label: '카테고리 관리',
    path: ROUTES.SETTINGS.CATEGORIES.generate(),
  },
  {
    id: 'menus',
    label: '메뉴 관리',
    matchPattern: `${ROUTES.SETTINGS.path}/${ROUTES.SETTINGS.CATEGORY_MENUS.path}`,
    subMenus: [1, 2, 3, 4, 5, 6, 7, 8, 9].map((id) => ({
      id,
      label: `카테고리 ${id} 메뉴`,
      path: ROUTES.SETTINGS.CATEGORY_MENUS.generate(id),
    })),
  },
  {
    id: 'sales',
    label: '매출 관리',
    matchPattern: `${ROUTES.SETTINGS.path}/${ROUTES.SETTINGS.SALES.SUMMARY.path}`,
    subMenus: [
      {
        id: 'summary',
        label: '매출 요약',
        path: ROUTES.SETTINGS.SALES.SUMMARY.generate(),
      },
    ],
  },
];
