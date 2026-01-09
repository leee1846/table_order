export const ROUTES = {
  LOGIN: {
    path: '/login',
    generate: () => '/login',
  },

  ROOT: {
    path: '/',
    generate: () => '/',
  },

  ADMIN_WEB: {
    path: '/admin',
    generate: () => '/admin',

    STORES: {
      path: 'stores',
      generate: () => '/admin/stores',
    },
    STORES_NEW: {
      path: 'stores/new',
      generate: () => '/admin/stores/new',
    },
    STORES_EDIT: {
      path: 'stores/:shopCode/edit',
      generate: (shopCode: string) => `/admin/stores/${shopCode}/edit`,
    },
    MYPAGE: {
      path: 'mypage',
      generate: () => '/admin/mypage',
    },
    APP_HISTORY: {
      path: 'app-history',
      generate: () => '/admin/app-history',
    },
    APP_HISTORY_NEW: {
      path: 'app-history/new',
      generate: () => '/admin/app-history/new',
    },
    APP_HISTORY_EDIT: {
      path: 'app-history/:id/edit',
      generate: (id: string | number) => `/admin/app-history/${id}/edit`,
    },
    APP_HISTORY_DETAIL: {
      path: 'app-history/:id',
      generate: (id: string | number) => `/admin/app-history/${id}`,
    },
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
  NOT_FOUND: {
    path: '/404',
    generate: () => '/404',
  },
} as const;
