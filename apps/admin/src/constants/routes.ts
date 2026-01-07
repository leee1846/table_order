export const ROUTES = {
  LOGIN: {
    path: '/login',
    generate: () => '/login',
  },

  ROOT: {
    path: '/',
    generate: () => '/',
  },

  STORES: {
    path: '/stores',
    generate: () => '/stores',
  },

  SETTINGS: {
    path: '/settings',

    NOTICES: {
      path: 'notices',
      generate: () => '/settings/notices',
    },
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
    TABLES: {
      path: 'tables',
      generate: () => '/settings/tables',
    },
    THEME: {
      path: 'theme',

      START_SCREEN: {
        path: 'start-screen',
        generate: () => '/settings/theme/start-screen',
      },
      MENU_SCREEN: {
        path: 'menu-screen',
        generate: () => '/settings/theme/menu-screen',
      },
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
