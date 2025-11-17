export const ROUTES = {
  SETTINGS: {
    path: '/settings',

    CATEGORIES: {
      path: 'categories',
      generate: () => '/settings/categories',
    },
    CATEGORY_MENUS: {
      path: 'categories/:id/menus',
      generate: (id: string | number) => `/settings/categories/${id}/menus`,
    },
    SALES: {
      path: 'sales',

      SUMMARY: {
        path: 'summary',
        generate: () => '/settings/sales/summary',
      },
      ORDER: {
        path: 'order',
        generate: () => '/settings/sales/order',
      },
      CARD: {
        path: 'card',
        generate: () => '/settings/sales/card',
      },
      CASH: {
        path: 'cash',
        generate: () => '/settings/sales/cash',
      },
      MENU: {
        path: 'menu',
        generate: () => '/settings/sales/menu',
      },
    },
    STYLE: {
      path: 'style',
      generate: () => '/settings/style',
    },
    MISCELLANEOUS: {
      path: 'misc',
      generate: () => '/settings/misc',
    },
  },
  TABLES: {
    path: '/tables',
    generate: () => '/tables',
  },
  TABLE_DETAIL: {
    path: '/tables/:tableNum',
    generate: (tableNum: string | number) => `/tables/${tableNum}`,
  },
} as const;
