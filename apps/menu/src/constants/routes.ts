export const ROUTES = {
  ROOT: {
    path: '/',
    generate: () => '/',
  },

  LOGIN: {
    path: '/login',
    generate: () => '/login',
  },

  TABLES: {
    path: 'tables',
    generate: () => '/tables',

    TABLE_DETAIL: {
      path: '/tables/:tableNum',
      generate: (tableNum: string | number) => `/tables/${tableNum}`,
    },
  },

  SETTINGS: {
    path: '/settings',

    MISCELLANEOUS: {
      path: 'misc',
      generate: () => '/settings/misc',
    },
    PAYMENTS_CARDS: {
      path: 'payments/cards',
      generate: () => '/settings/payments/cards',
    },
  },
} as const;
